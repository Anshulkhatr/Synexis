import axios from "../../config/axiosConfig";

const API_URL = "/api/chat";

const fetchContacts = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/contacts", options);
    return response.data;
};

const fetchMessages = async (otherUserId, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/messages/" + otherUserId, options);
    return response.data;
};

const chatService = { fetchContacts, fetchMessages };
export default chatService;
