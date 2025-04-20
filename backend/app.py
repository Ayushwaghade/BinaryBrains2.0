from flask import Flask, request, jsonify,session
from flask_cors import CORS
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv
import uuid
import pandas as pd

df = pd.read_csv("E:/RGI-Hackathon/backend/jobs_new.csv")
df = df[['city', 'category', 'job_title', 'job_description', 'company_name']].dropna()
df['city'] = df['city'].str.lower().str.strip()
df['category'] = df['category'].str.lower().str.strip()

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "AI Workforce Development API is running!"


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        skills = data.get("skills", "")
        career_goal = data.get("goal", "")
        education_level = data.get("education_level", "")
        experience_years = data.get("experience_years", "")
        current_job_title = data.get("current_job_title", "")
        preferred_learning_style = data.get("preferred_learning_style", "")
        available_hours_per_week = data.get("available_hours_per_week", "")
        location = data.get("location", "")
        interests = data.get("interests", "")
        certifications = data.get("certifications", "")

        if not skills or not career_goal:
            return jsonify({"error": "Fields 'skills' and 'goal' are required."}), 400

        prompt = f"""
        A user has the following background and is seeking career guidance. Address the user as 'you'.

        Career Goal: {career_goal}
        Skills: {skills}
        Education Level: {education_level}
        Experience: {experience_years} years
        Current Job Title: {current_job_title}
        Interests: {interests}
        Certifications: {certifications}

        Tasks:
        1. Analyze their current skillset.
        2. Identify key skill gaps related to their goal.
        """

        response = model.generate_content(prompt)

        return jsonify({
            "status": "success",
            "analysis": response.text
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/get-path", methods=["POST"])
def get_path():
    try:
        data = request.get_json()
        
        career_goal = data.get("goal", "")
        preferred_learning_style = data.get("preferred_learning_style", "video")
        available_hours_per_week = data.get("available_hours_per_week", "")
        current_skill_level = data.get("current_skill_level", "beginner")  # optional
        
        if not career_goal:
            return jsonify({"error": "Field 'goal' is required."}), 400
        
        prompt = f""" 
        You are a professional career mentor AI.
        
        A user wants to become a {career_goal}. They prefer learning via: {preferred_learning_style}. 
        They can dedicate {available_hours_per_week} hours per week. Current skill level: {current_skill_level}
        
        Generate a structured learning path in the following JSON format:
        
        [
          {{
            "stage": "Beginner",
            "skill": "Skill Name",
            "reason": "Why this is important",
            "video_link": "Specific YouTube URL (https://www.youtube.com/watch?v=XXXX) or course link",
            "estimated_time": "X hours"
          }},
          ...
        ]
        
        IMPORTANT INSTRUCTIONS:
        1. For video_link, provide ACTUAL YouTube URLs (https://www.youtube.com/watch?v=XXXX format) or specific course URLs from platforms like Coursera, edX, or Udemy.
        2. Do NOT use placeholder URLs or example links.
        3. Only include free resources that exist and are accessible.
        4. Prioritize well-known educational channels and courses relevant to {career_goal}.
        5. Return only valid, properly formatted JSON without any other text.
        """
        
        response = model.generate_content(prompt)
        
        response_text = response.text
        
        import re
        import json
        
        json_match = re.search(r'\[\s*{.+}\s*\]', response_text, re.DOTALL)
        
        if json_match:
            json_str = json_match.group(0)
            learning_path = json.loads(json_str)
        else:
            try:
                learning_path = json.loads(response_text)
            except json.JSONDecodeError:
                cleaned_text = re.sub(r'```json|```', '', response_text).strip()
                try:
                    learning_path = json.loads(cleaned_text)
                except json.JSONDecodeError:
                    return jsonify({
                        "status": "error",
                        "message": "Could not parse the AI response into JSON.",
                        "raw_response": response_text
                    }), 500
        
        if not isinstance(learning_path, list):
            return jsonify({
                "status": "error",
                "message": "The AI did not return a proper list format.",
                "raw_response": response_text
            }), 500
        
        for item in learning_path:
            video_link = item.get("video_link", "")
            if not video_link.startswith(("https://www.youtube.com/", "https://youtu.be/", 
                                         "https://coursera.org/", "https://www.edx.org/", 
                                         "https://www.udemy.com/", "https://www.linkedin.com/learning/")):
                item["video_link"] = "https://www.youtube.com/results?search_query=" + "+".join(
                    f"{career_goal} {item['skill']}".split())
        
        return jsonify({
            "status": "success",
            "learning_path": learning_path
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

quiz_storage={}
# Helper function to generate quiz
def generate_quiz_prompt(goal, skills, subject, difficulty):
    skills_list = [s.strip() for s in skills.split(',')] if isinstance(skills, str) else skills
    prompt = f"""
    Generate a {difficulty} level multiple-choice quiz on the subject "{subject}" related to the career path of becoming a {goal}.
    The user's current skills include: {', '.join(skills_list) if skills_list else 'none specified'}
    
    Create 10 questions following these requirements:
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
    """
    return prompt

# Function to parse AI response
def parse_ai_response(response_text):
    try:
        json_match = re.search(r'\[\s*{.+}\s*\]', response_text, re.DOTALL)
        if json_match:
            quiz_json = json.loads(json_match.group(0))
            return quiz_json
        else:
            return None
    except Exception as e:
        return None

# Quiz generation endpoint
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    try:
        data = request.get_json()
        goal, skills, subject, difficulty = data.get("goal"), data.get("skills"), data.get("subject"), data.get("difficulty", "easy")

        if not subject or not difficulty:
            return jsonify({"status": "error", "message": "Subject and difficulty are required."}), 400

        prompt = generate_quiz_prompt(goal, skills, subject, difficulty)
        response = model.generate_content(prompt)
        
        quiz_json = parse_ai_response(response.text)
        
        if quiz_json:
            # Process quiz and store it
            quiz_id = str(uuid.uuid4())
            quiz_storage[quiz_id] = {"questions": quiz_json, "answers": [q["correct_answer"] for q in quiz_json]}
            return jsonify({"status": "success", "quiz": quiz_json, "quiz_id": quiz_id})
        else:
            return jsonify({"status": "error", "message": "Failed to parse AI response"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    try:
        data = request.get_json()
        user_answers = data.get("answers", [])
        quiz_id = data.get("quiz_id", "")
        subject = data.get("subject", "")
        difficulty = data.get("difficulty", "easy")
        
        if not user_answers:
            return jsonify({"status": "error", "message": "No answers provided."}), 400

        if not quiz_id or quiz_id not in quiz_storage:
            # Strict: quiz_id is required
            return jsonify({
                "status": "error",
                "message": "quiz_id is required for evaluation and must be valid.",
                "ai_evaluation": True
            }), 400

        # Proceed with evaluation using stored quiz
        correct_answers = quiz_storage[quiz_id]["answers"]
        questions = quiz_storage[quiz_id]["questions"]

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

        # Feedback
        if percentage >= 90:
            feedback = "Excellent! You've mastered this subject."
        elif percentage >= 75:
            feedback = "Great job! You have a strong understanding."
        elif percentage >= 60:
            feedback = "Good work! There's room for improvement."
        elif percentage >= 40:
            feedback = "Keep learning. Review this subject more."
        else:
            feedback = "Needs more practice. Don't give up!"

        # Recommendations
        recommendations = []
        if score < total_questions:
            incorrect_questions = [
                questions[i] for i in range(len(user_answers))
                if user_answers[i] != correct_answers[i]
            ]
            topics = []
            for q in incorrect_questions[:3]:
                words = q["question"].lower().split()
                keywords = [w for w in words if len(w) > 4 and w.isalpha()][:2]
                topics.extend(keywords)

            if topics:
                recommendations = [
                    f"Review concepts related to: {', '.join(set(topics))}",
                    "Focus on strengthening your understanding of missed questions.",
                    "Try more practice exercises on these areas."
                ]

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

# Function to calculate score
def calculate_score(user_answers, correct_answers):
    score = sum(1 for ua, ca in zip(user_answers, correct_answers) if ua == ca)
    detailed_results = [{"user_answer": ua, "correct_answer": ca, "is_correct": ua == ca} for ua, ca in zip(user_answers, correct_answers)]
    return score, detailed_results

# Function to generate feedback
def generate_feedback(score, total_questions):
    percentage = (score / total_questions) * 100
    if percentage >= 90:
        feedback = "Excellent!"
    elif percentage >= 75:
        feedback = "Great job!"
    elif percentage >= 60:
        feedback = "Good work!"
    else:
        feedback = "Needs improvement."
    return feedback, []

# AI fallback evaluation
def evaluate_with_ai(user_answers, subject, difficulty, quiz_id=None):
    """Evaluate quiz using AI (requires quiz_id to access actual questions and correct answers)."""
    try:
        # Require quiz_id to fetch questions and correct answers
        if not quiz_id or quiz_id not in quiz_storage:
            return jsonify({
                "status": "error",
                "message": "quiz_id is required for evaluation and must be valid.",
                "ai_evaluation": True
            }), 400

        # Fetch the quiz data
        quiz = quiz_storage[quiz_id]
        questions = quiz.get("questions", [])
        correct_answers = quiz.get("answers", [])

        if not questions or not correct_answers or len(questions) != len(user_answers):
            return jsonify({
                "status": "error",
                "message": "Incomplete quiz data for evaluation.",
                "ai_evaluation": True
            }), 400

        # Format for AI: include questions, user answers, and correct answers
        quiz_text = "\n".join([
            f"Q{i+1}: {questions[i]}\nUser Answer: {user_answers[i]}\nCorrect Answer: {correct_answers[i]}"
            for i in range(len(user_answers))
        ])

        prompt = f"""
        Evaluate the following quiz for a {difficulty} level on the subject {subject}.

        {quiz_text}

        Please provide the evaluation in JSON format:
        {{
            "score": X, 
            "total": {len(user_answers)},
            "feedback": "Overall performance summary",
            "explanations": ["Explanation for Q1", "Explanation for Q2", ...]
        }}
        """

        response = model.generate_content(prompt)
        response_text = response.text

        # Extract JSON from the AI's response
        json_match = re.search(r'{.+}', response_text, re.DOTALL)
        if json_match:
            evaluation = json.loads(json_match.group(0))
        else:
            return jsonify({
                "status": "error",
                "message": "AI response not in expected format.",
                "ai_evaluation": True
            }), 500

        percentage = (evaluation["score"] / evaluation["total"]) * 100

        return jsonify({
            "status": "success",
            "score": evaluation["score"],
            "total_questions": evaluation["total"],
            "percentage": percentage,
            "feedback": evaluation["feedback"],
            "explanations": evaluation["explanations"],
            "ai_evaluation": True
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error evaluating with AI: {str(e)}",
            "ai_evaluation": True
        }), 500

interview_sessions = {}

def generate_questions(job_role, company_name):
    prompt = f"Generate 10-15 interview questions for a {job_role} role at {company_name}."
    response = genai.GenerativeModel("gemini-1.5-pro").generate_content(prompt)
    return response.text.split("\n") if response.text else ["No questions generated."]

@app.route('/interview/generate_questions', methods=['POST'])
def get_questions():
    data = request.json
    job_role = data.get("job_role")
    company_name = data.get("company_name")

    if not job_role or not company_name:
        return jsonify({"status": "error", "message": "Job role and company name are required."})

    questions = generate_questions(job_role, company_name)

    interview_id = str(uuid.uuid4())
    interview_sessions[interview_id] = questions  

    return jsonify({"status": "success", "interview_id": interview_id, "questions": questions})

@app.route('/interview/submit_answers', methods=['POST'])
def evaluate_interview():
    data = request.json
    interview_id = data.get("interview_id")
    user_answers = data.get("answers", [])

    questions = interview_sessions.get(interview_id)

    if not questions:
        return jsonify({"status": "error", "message": "Invalid interview session."})

    if len(user_answers) != len(questions):
        return jsonify({"status": "error", "message": "Mismatch between the number of questions and answers."})

    user_answers = [answer if answer is not None else "" for answer in user_answers]

    qna_feedback = []
    prompt = "You are an expert technical interviewer. Evaluate the following answers:\n\n"

    for i, (q, a) in enumerate(zip(questions, user_answers)):
        prompt += f"Q{i+1}: {q}\nAnswer: {a}\n\n"

    prompt += "\nProvide constructive feedback for each answer and a final summary score out of 10 with comments."

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return jsonify({
        "status": "success",
        "feedback": response.text.strip()
    })

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "")

        if not user_message:
            return jsonify({"status": "error", "message": "No message provided"}), 400

        # Instruction + message for Gemini
        prompt = f"""
        You are a helpful chatbot on a job portal. Answer the user's question briefly.
        Do not solve everything directly — guide the user instead, so they learn and adapt.
        Question: {user_message}
        """

        response = model.generate_content(prompt)
        reply = response.text.strip()

        return jsonify({"status": "success", "reply": reply})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/predict_job', methods=['POST'])
def get_jobs_route():
    data = request.get_json()

    city = data.get('city', '').lower().strip()
    category1 = data.get('category1', '').lower().strip()
    category2 = data.get('category2', '').lower().strip()

    # Filter based on input
    filtered_df = df[((df['city'].str.contains(city, case=False, na=False)) &
                      ((df['category'].str.contains(category1, case=False, na=False)) |
                       (df['category'].str.contains(category2, case=False, na=False))))]

    job_count = len(filtered_df)
    job_titles = filtered_df['job_title'].unique().tolist()[:10]
    job_descriptions = filtered_df['job_description'].unique().tolist()[:5]
    company_names = filtered_df['company_name'].unique().tolist()[:5]

    if job_count == 0:
        return jsonify({
            "status": "no_match",
            "message": "No exact matches found.",
            "available_cities": df['city'].unique().tolist()[:10],
            "available_categories": df['category'].unique().tolist()[:10]
        })

    # Combine results into a success response
    result = filtered_df.to_dict(orient='records')
    return jsonify({
        "status": "success",
        "total_jobs": job_count,
        "job_titles": job_titles,
        "job_descriptions": job_descriptions,
        "company_names": company_names,
        "result": result  # Add the filtered job details here
    })



if __name__ == "__main__":
    app.run(debug=True)
