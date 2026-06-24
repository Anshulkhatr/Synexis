import axios from "../../config/axiosConfig"

const API_URL = "/api/comments"

const fetchComments = async (pid, token) => {
    let options = { headers: { authorization: `Bearer ${token}` } }
    const response = await axios.get(`${API_URL}/${pid}`, options)
    return response.data
}

const addComment = async (pid, text, token) => {
    let options = { headers: { authorization: `Bearer ${token}` } }
    const response = await axios.post(`${API_URL}/${pid}`, { text }, options)
    return response.data
}

const deleteComment = async (cid, token) => {
    let options = { headers: { authorization: `Bearer ${token}` } }
    const response = await axios.delete(`${API_URL}/${cid}`, options)
    return response.data
}

const commentService = { fetchComments, addComment, deleteComment }

export default commentService
