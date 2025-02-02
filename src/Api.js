import axios from "axios";
const API_URL =process.env.REACT_APP_API_URL || "/Uw5CrX";

const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL); 
    console.log("API Response:", response); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return []; 
  }
};

export default fetchQuizData;
