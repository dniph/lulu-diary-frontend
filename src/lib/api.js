import axios from "axios";

const API_BASE_URL = "https://localhost:5180/api"; 

export const fetchPublicDiaries = async () => {
    try {
    const response = await axios.get(`${API_BASE_URL}/diaries`);
    return response.data;
    } catch (error) {
    console.error("Error obtaining public diaries", error);
    return [];
    }
};
