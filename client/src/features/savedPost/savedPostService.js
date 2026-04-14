import axios from "../../config/axiosConfig"

const API_URL = "/api/saved-posts"


const getSavedPosts = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, options)
    return response.data
}


const savePost = async (pid, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + "/" + pid, {}, options)
    return response.data
}


const removeSavedPost = async (pid, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(API_URL + "/" + pid, options)
    return response.data
}

const savedPostService = { getSavedPosts, savePost, removeSavedPost }

export default savedPostService
