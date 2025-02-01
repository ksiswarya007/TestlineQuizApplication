import axios from "axios";
const API_URL = "/Uw5CrX";

const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL); // API call
    console.log("API Response:", response); // Log the response data
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return []; // Return an empty array in case of an error
  }
};

export default fetchQuizData;
