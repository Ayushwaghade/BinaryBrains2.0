from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import re

app = Flask(__name__)
# Set a secret key for session management
app.secret_key = "your_secret_key_here"  # Change this to a secure random string in production
CORS(app, supports_credentials=True)  # Enable CORS with credentials for session support

# Import the AI model (assuming you're using Google's Generative AI)
from google.generativeai import genai

# Configure the API key
genai.configure(api_key="YOUR_API_KEY_HERE")  # Replace with your actual API key

# Create model instance
model = genai.GenerativeModel('gemini-pro')

# Dictionary to store quizzes temporarily (in production use a database)
# Format: {quiz_id: {"questions": [...], "answers": [...]}}
quiz_storage = {}


@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    try:
        data = request.get_json()

        goal = data.get("goal", "")
        skills = data.get("skills", "")
        subject = data.get("subject", "")
        difficulty = data.get("difficulty", "easy")

        if not subject or not difficulty:
            return jsonify({"status": "error", "message": "Subject and difficulty are required."}), 400

        # Convert skills to list if it's a string
        if isinstance(skills, str):
            skills_list = [s.strip() for s in skills.split(',') if s.strip()]
        else:
            skills_list = skills

        # Format the prompt for the AI model
        prompt = f"""
        Generate a {difficulty} level multiple-choice quiz on the subject "{subject}" related to the career path of becoming a {goal}.
        The user's current skills include: {', '.join(skills_list) if skills_list else 'none specified'}
        
        Create 5 questions following these requirements:
        1. Each question should have 1 correct answer and 3 incorrect options (distractors)
        2. Questions should be appropriate for the {difficulty} difficulty level
        3. Questions should be relevant to developing skills for a {goal} career path
        4. The content should match the subject of {subject}
        
        Respond ONLY with a JSON array in this exact format:
        [
          {{
            "question": "The question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct_answer": "The exact text of the correct option from the options array"
          }},
          ...more questions...
        ]
        
        Do not include any explanatory text, only the JSON array.
        """

        # Generate content from the AI model
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON content from the response
        try:
            # Try to find JSON in the response by looking for array pattern
            json_match = re.search(r'\[\s*{.+}\s*\]', response_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                quiz_json = json.loads(json_str)
            else:
                # Try parsing the whole response as JSON
                quiz_json = json.loads(response_text)
            
            # Generate a unique ID for this quiz
            import uuid
            quiz_id = str(uuid.uuid4())
            
            # Store the correct answers for later verification
            correct_answers = []
            frontend_quiz = []
            
            # Process each question
            for question in quiz_json:
                correct = question.get("correct_answer")
                
                # Ensure correct_answer exists and is in options
                if not correct or correct not in question["options"]:
                    # If no valid correct answer, use the first option
                    correct = question["options"][0]
                
                # Store the correct answer
                correct_answers.append(correct)
                
                # Create the question object for the frontend
                # (without revealing the correct answer)
                frontend_quiz.append({
                    "question": question["question"],
                    "options": question["options"]
                })
            
            # Store the quiz data for later assessment
            quiz_storage[quiz_id] = {
                "questions": frontend_quiz,
                "answers": correct_answers
            }
            
            # Return the quiz to the frontend with the ID
            return jsonify({
                "status": "success",
                "quiz": frontend_quiz,
                "quiz_id": quiz_id
            })
        
        except json.JSONDecodeError:
            # If JSON parsing fails, return a cleaner error
            return jsonify({
                "status": "error", 
                "message": "Could not parse AI response into proper quiz format.",
                "raw_response": response_text
            }), 500
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    try:
        data = request.get_json()
        user_answers = data.get("answers", [])
        quiz_id = data.get("quiz_id", "")
        
        if not user_answers:
            return jsonify({"status": "error", "message": "No answers provided."}), 400
            
        if not quiz_id or quiz_id not in quiz_storage:
            # If no quiz ID is provided or invalid, use AI to evaluate the answers
            return evaluate_with_ai(user_answers, data.get("subject", ""), data.get("difficulty", "easy"))
        
        # Get the correct answers from storage
        correct_answers = quiz_storage[quiz_id]["answers"]
        
        # Calculate score
        score = 0
        detailed_results = []
        
        for i, (user_ans, correct_ans) in enumerate(zip(user_answers, correct_answers)):
            is_correct = user_ans == correct_ans
            if is_correct:
                score += 1
                
            detailed_results.append({
                "question_index": i,
                "user_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct
            })
        
        total_questions = len(user_answers)
        percentage = (score / total_questions) * 100 if total_questions > 0 else 0
        
        # Generate appropriate feedback based on score
        if percentage >= 90:
            feedback = "Excellent! You've mastered this subject."
        elif percentage >= 75:
            feedback = "Great job! You have a strong understanding of this subject."
        elif percentage >= 60:
            feedback = "Good work! You're on the right track, but there's room for improvement."
        elif percentage >= 40:
            feedback = "You're making progress, but you should review this subject more."
        else:
            feedback = "You need more practice with this subject. Don't give up!"
            
        # Generate learning recommendations based on incorrect answers
        recommendations = []
        if score < total_questions:
            # Find topics where the user needs improvement
            incorrect_questions = quiz_storage[quiz_id]["questions"][:len(user_answers)]
            incorrect_questions = [q for i, q in enumerate(incorrect_questions) if user_answers[i] != correct_answers[i]]
            
            # Extract topics from incorrect questions
            topics = []
            for q in incorrect_questions[:3]:  # Limit to top 3 missed questions
                # Extract key concepts from the question
                question_text = q["question"].lower()
                # Simple extraction based on question content
                words = question_text.split()
                keywords = [w for w in words if len(w) > 4 and w.isalpha()][:2]  # Simple approach
                topics.extend(keywords)
            
            if topics:
                recommendations = [
                    f"Review concepts related to: {', '.join(set(topics))}",
                    f"Focus on strengthening your understanding of the missed questions",
                    f"Consider additional practice exercises on these topics"
                ]
        
        # Return the results
        return jsonify({
            "status": "success",
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "feedback": feedback,
            "detailed_results": detailed_results,
            "recommendations": recommendations
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def evaluate_with_ai(user_answers, subject, difficulty):
    """Fallback method to evaluate quiz using AI if quiz_id is not available"""
    try:
        # Create a prompt for the AI to evaluate the answers
        answers_text = "\n".join([f"Answer {i+1}: {ans}" for i, ans in enumerate(user_answers)])
        
        prompt = f"""
        Evaluate these answers for a {difficulty} level quiz about {subject}:
        
        {answers_text}
        
        Provide evaluation in JSON format with:
        1. A score out of {len(user_answers)}
        2. Feedback on overall performance
        3. Brief explanation for each answer
        
        Format:
        {{
          "score": X,
          "total": {len(user_answers)},
          "feedback": "Overall feedback",
          "explanations": ["Explanation 1", "Explanation 2", ...]
        }}
        """
        
        # Get evaluation from AI
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Try to extract JSON
        json_match = re.search(r'{.+}', response_text, re.DOTALL)
        if json_match:
            evaluation = json.loads(json_match.group(0))
        else:
            # If no JSON found, create default response
            evaluation = {
                "score": len(user_answers) // 2,  # Default to 50%
                "total": len(user_answers),
                "feedback": "Your answers have been recorded, but we couldn't provide detailed feedback.",
                "explanations": [""] * len(user_answers)
            }
        
        # Transform to our response format
        percentage = (evaluation["score"] / evaluation["total"]) * 100 
        
        return jsonify({
            "status": "success",
            "score": evaluation["score"],
            "total_questions": evaluation["total"],
            "percentage": percentage,
            "feedback": evaluation["feedback"],
            "ai_evaluation": True
        })
        
    except Exception as e:
        # If AI evaluation fails, return basic response
        return jsonify({
            "status": "success",
            "score": len(user_answers) // 2,
            "total_questions": len(user_answers),
            "percentage": 50.0,
            "feedback": "Your quiz has been submitted, but we couldn't provide detailed feedback.",
            "ai_evaluation": True
        })

if __name__ == "__main__":
    app.run(debug=True)