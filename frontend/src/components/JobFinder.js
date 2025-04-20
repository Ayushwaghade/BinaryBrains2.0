import React, { useState } from "react";
import axios from "axios";
const cities = [
  "Abohar",
  "Administrative Building",
  "Agra",
  "Ahmadnagar",
  "Ahmedabad",
  "Ahmedabad Thaltej Road",
  "Airoli",
  "Akola",
  "Aligarh",
  "Allahabad",
  "Alleppey",
  "Alwal",
  "Alwar",
  "Ambasamudram",
  "Amreli",
  "Amritsar",
  "Andheri",
  "Andhra Pradesh",
  "Andra",
  "Angamali",
  "Ankleshwar",
  "Anna Nagar",
  "Annur",
  "Ariyalur",
  "Arumbakkam",
  "Asansol",
  "Assam",
  "Assam Tribune",
  "Aurangabad",
  "Badarpur",
  "Baddi",
  "Badgam",
  "Bahadurgarh",
  "Ballia",
  "Baner",
  "Bangalore Urban",
  "Baramati",
  "Barasat",
  "Bareilly",
  "Barmer",
  "Batala City",
  "Belgaum",
  "Bengaluru",
  "Bhagalpur",
  "Bhajan Pura",
  "Bharuch",
  "Bhavnagar",
  "Bhayandar",
  "Bhilai",
  "Bhiwadi",
  "Bhiwandi",
  "Bhopal",
  "Bhubaneshwar",
  "Bidar",
  "Bilaspur",
  "Bishnah",
  "Bokaro",
  "Borivali",
  "Burnihat",
  "Calangute",
  "Calicut",
  "Cannanore",
  "Chandigarh",
  "Changanacheri",
  "Chengalpattu Bus Stand",
  "Chennai",
  "Cherthala",
  "Chhindwara",
  "Chikmagalur",
  "Chittaurgarh",
  "Coimbatore",
  "Coimbatore South",
  "Cortalim",
  "Cuddalore",
  "Cuttack",
  "Dadra",
  "Dahej",
  "Dalhousie",
  "Daman",
  "Darjeeling Bazar",
  "Dausa",
  "Dehlon",
  "Dehra Dun",
  "Dehradun Ho",
  "Delhi",
  "Deoria",
  "Dewas",
  "Dhamtari",
  "Dhanbad",
  "Dharampur",
  "Dharmapuri",
  "Dharuhera",
  "Dharwad",
  "Dhule",
  "Dilsukhnagar",
  "Dindigul",
  "Dombivli",
  "Dumka",
  "Durg",
  "Durgapur",
  "Dwarka",
  "Edapalli",
  "Ernakulam",
  "Erode",
  "Faridabad",
  "Fort",
  "Gandhidham",
  "Gandhinagar",
  "Ganganagar",
  "Gautam Budh Nagar",
  "Ghaziabad",
  "Giddarbaha",
  "Goa",
  "Gondia",
  "Gorakhpur",
  "Greater Kailash Ii",
  "Greater Noida",
  "Green Park Market",
  "Guduru",
  "Gujrat",
  "Gurgaon",
  "Gurgaon H O",
  "Gurgaon Road",
  "Guruvayur",
  "Guwahati",
  "Gwalior",
  "Hadapsar",
  "Haldwani",
  "Haridwar",
  "Haryana",
  "Hassan",
  "Hauz Khas",
  "Himachal Pradesh",
  "Hinjewadi",
  "Hisar",
  "Hoshiarpur",
  "Hoskote",
  "Hosur",
  "Howrah",
  "Hubli",
  "Hyderabad",
  "Inderlok",
  "India",
  "Indore",
  "Indore City",
  "Irungattukottai",
  "J P Nagar",
  "Jagadhri",
  "Jagdalpur",
  "Jaipur",
  "Jajpur",
  "Jalandhar",
  "Jalandhar City H O",
  "Jalna",
  "Jalor",
  "Jalpaiguri",
  "Jammu",
  "Jamnagar",
  "Jamshedpur",
  "Janakpuri Block C",
  "Jasola",
  "Jeewan Park",
  "Jhagadia",
  "Jharkhand",
  "Jharsuguda",
  "Jigani",
  "Jodhpur",
  "Jorhat",
  "Joypur",
  "Junagadh",
  "Kallakurichi",
  "Kalyan",
  "Kalyan Nagar",
  "Kalyani Nagar",
  "Kanayannur",
  "Kanchipuram",
  "Kanjurmarg",
  "Kannangad",
  "Kanpur",
  "Karad",
  "Karaikkudi",
  "Karkal",
  "Karnal",
  "Karnataka",
  "Karur",
  "Kawai",
  "Kayankulam",
  "Keelkattalai",
  "Kendraparha",
  "Kerala",
  "Khandagiri",
  "Khanna",
  "Kharadi",
  "Kharagpur",
  "Kharar",
  "Kharghar",
  "Khatima",
  "Kishangarh",
  "Kizhake Chalakudi",
  "Kochi",
  "Kolhapur",
  "Kolkata",
  "Kollam",
  "Kota",
  "Kotkapura",
  "Kottayam",
  "Kunnamkulam",
  "Kurnool",
  "Lajpat Nagar",
  "Landran",
  "Latur",
  "Lonavale",
  "Lucknow",
  "Ludhiana",
  "Ludhiana East",
  "Madgaon",
  "Madhepura",
  "Madhubani",
  "Madhya Pradesh",
  "Madukkarai",
  "Madurai",
  "Mahabaleshwar",
  "Mahad",
  "Maharashtra",
  "Mahe",
  "Mahemdavad",
  "Majorda",
  "Malappuram",
  "Maldah",
  "Manchar",
  "Mandi Gobindgarh",
  "Mandsaur",
  "Manesar",
  "Mangalore",
  "Manjeri",
  "Marakkanam",
  "Marathahalli",
  "Market",
  "Mathura",
  "Mavelikara",
  "Mayur Vihar",
  "Medinipur",
  "Meerut",
  "Mira Road",
  "Mohali",
  "Mohali Sas Nagar",
  "Moradabad",
  "Morbi",
  "Morinda",
  "Moti Nagar",
  "Mukundnagar",
  "Mulmula",
  "Mulund",
  "Mumbai",
  "Munnar",
  "Muvattupuzha",
  "Muzaffarnagar",
  "Muzaffarpur",
  "Mysore",
  "Nagercoil",
  "Nagloi",
  "Nagpur",
  "Nalukettu BO",
  "Namakkal",
  "Namchi",
  "Nanded",
  "Nangloi Jat",
  "Narayangaon",
  "Nashik",
  "Navi Mumbai",
  "Nellore",
  "New Delhi",
  "Noida",
  "North Industrial Area",
  "Nuvem",
  "Odhav",
  "Old Begumpet",
  "Orissa",
  "Palakkad district",
  "Palam",
  "Palghar",
  "Palghat",
  "Panaji",
  "Panchgani",
  "Panchkula",
  "Panvel",
  "Parbhani",
  "Patancheru",
  "Patel Nagar",
  "Path",
  "Pathanamthitta",
  "Patiala",
  "Patna",
  "Pattambi",
  "Pernem",
  "Perumbavoor",
  "Perundurai",
  "Phagwara",
  "Phalta",
  "PimpriChinchwad",
  "Pitampura",
  "Porbandar",
  "Porvorim",
  "Powai",
  "Puducherry",
  "Pudukkottai",
  "Pudur",
  "Pune",
  "Punjab",
  "Puruliya",
  "Raichur",
  "Raipur",
  "Raisen H O",
  "Rajahmundry",
  "Rajajinagar",
  "Rajasthan",
  "Rajasthan University",
  "Rajkot",
  "Ramanattukara",
  "Ramgarh",
  "Ranchi",
  "Ranjangaon",
  "Rasipuram",
  "Raurkela",
  "Remote",
  "Rohtak",
  "Rupnarayanpur",
  "Saharanpur",
  "Sahibzada Ajit Singh Nagar",
  "Saket",
  "Salem",
  "Sambalpur",
  "Sanand",
  "Sanghol",
  "Sangli",
  "Santarpur",
  "Satara",
  "Satna",
  "Secunderabad",
  "Shahapur",
  "Shiliguri",
  "Shimoga",
  "Shoolagiri",
  "Siddipet",
  "Sillod",
  "Simga",
  "Singhbhum",
  "Sirsa",
  "Solapur",
  "Sonipat",
  "Srinagar",
  "Sriperumbudur",
  "Subhash Nagar",
  "Subrahmanya",
  "Sukma",
  "Surat",
  "Surguja",
  "Suriapet",
  "Taliparamba",
  "Tamil Nadu",
  "Tamilnadu",
  "Tanuku",
  "Taramani",
  "Tardeo",
  "Tenkasi",
  "Thalassery",
  "Thane",
  "Thanjavur",
  "The Rutu Estate",
  "Thiruvananthapuram",
  "Tiruchchirappalli",
  "Tirunelveli",
  "Tiruppur",
  "Tiruvalla",
  "Todupulai",
  "Tollygunge",
  "Trichur",
  "Udagamandalam",
  "Udaipur",
  "Ujjain",
  "Umargam",
  "University",
  "Unnao",
  "Uttar Pradesh",
  "Uttarkashi",
  "Vadodara",
  "Vaghodia",
  "Valia",
  "Vapi",
  "Varanasi",
  "Vasai",
  "Vasant Kunj",
  "Vellore",
  "Verna",
  "Vijayawada",
  "Vikhroli",
  "Visakhapatnam",
  "Vizianagaram",
  "Vrindavan",
  "Warangal",
  "Wayanad",
  "Worli",
  "Yamunanagar",
  "Yavatmal",
  "Zirakpur",
];

const categories = [
  "Accounting",
  "Admin",
  "Advertising",
  "Agriculture",
  "Architecture",
  "Arts",
  "Automation",
  "Bank",
  "Bpo",
  "Computer",
  "Construction",
  "Consultant",
  "Customer+Service",
  "Education",
  "Electrical",
  "Electronics",
  "Energy",
  "Engineering",
  "Facilities",
  "Finance",
  "Food+Service",
  "Fresher",
  "Government",
  "Healthcare",
  "Hospitality",
  "Human+Resources",
  "IT",
  "Insurance",
  "Internet",
  "Law+Enforcement",
  "Legal",
  "Loans",
  "Logistics",
  "Management",
  "Manufacturing",
  "Marketing",
  "Mechanical",
  "Medical",
  "Networking",
  "PR",
  "Part time",
  "Pharmaceutical",
  "Publishing",
  "Real+Estate",
  "Recruitment",
  "Restaurant",
  "Retail",
  "Sales",
  "Scientific",
  "Security",
  "Services",
  "Social+Media",
  "Teacher",
  "Telecommunication",
  "Training",
  "Transportation",
  "Travel",
  "Volunteering",
];

const JobFinder = () => {
  const [city, setCity] = useState("");
  const [branch, setBranch] = useState("");
  const [preferredCategory, setPreferredCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [prediction, setPrediction] = useState("");

  const handlePredict = async () => {
    try {
      const payload = {
        city,
        branch,
        preferredCategory,
        jobType,
      };

      const response = await axios.post(
        "http://localhost:5000/predict_job",
        payload
      );

      const {
        status,
        message,
        total_jobs,
        job_titles,
        job_descriptions,
        company_names,
        result,
      } = response.data;

      if (status === "no_match") {
        setPrediction(
          `No matching jobs found. Here are some available options:\n`
        );
        setPrediction(
          (prev) => prev + `Cities: ${message.available_cities.join(", ")}\n`
        );
        setPrediction(
          (prev) =>
            prev + `Categories: ${message.available_categories.join(", ")}\n`
        );
      } else if (status === "success" && total_jobs > 0) {
        const jobList = result
          .map(
            (job, index) =>
              `${index + 1}. ${job.job_title || "Unknown Job"} at ${
                job.company_name || "Unknown Company"
              }`
          )
          .join("\n");

        setPrediction(`Predicted Jobs:\n${jobList}`);
      } else {
        setPrediction("No jobs found.");
      }
    } catch (error) {
      console.error("Error while making prediction request:", error);
      setPrediction("Error in predicting the job. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>JobFinder</h2>

      <label style={styles.label}>City:</label>
      <input
        list="cityList"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={styles.input}
        placeholder="Type to search..."
      />
      <datalist id="cityList">
        {cities.map((c, i) => (
          <option key={i} value={c} />
        ))}
      </datalist>

      <label style={styles.label}>Your Branch:</label>
      <input
        list="branchList"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        style={styles.input}
        placeholder="Type to search..."
      />
      <datalist id="branchList">
        {categories.map((b, i) => (
          <option key={i} value={b} />
        ))}
      </datalist>

      <label style={styles.label}>Preferred Category:</label>
      <input
        list="categoryList"
        value={preferredCategory}
        onChange={(e) => setPreferredCategory(e.target.value)}
        style={styles.input}
        placeholder="Type to search..."
      />
      <datalist id="categoryList">
        {categories.map((cat, i) => (
          <option key={i} value={cat} />
        ))}
      </datalist>

      <label style={styles.label}>Job Type:</label>
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        style={styles.input}
      >
        <option value="">Select Job Type</option>
        <option value="All">All</option>
        <option value="Full-Time">Full-Time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
        <option value="Commission">Commission</option>
        <option value="walk-in">Walk-in</option>
        <option value="Volunteer">Volunteer</option>
        <option value="null">null</option>
      </select>

      <button style={styles.button} onClick={handlePredict}>
        Predict Job
      </button>

      {prediction && (
        <p style={{ ...styles.result, marginTop: "20px" }}>{prediction}</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "50%",
    margin: "50px auto",
    background: "white",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
  },
  label: {
    fontWeight: "bold",
    marginTop: "10px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  result: {
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default JobFinder;
