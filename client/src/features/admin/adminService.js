import axios from "../../config/axiosConfig"

const API_URL = "/api/admin"


const fetchAllUsers = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + "/users", options)
    return response.data
}

const fetchAllPosts = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + "/posts", options)
    return response.data
}


const fetchAllReports = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + "/reports", options)
    return response.data
}


const updateUser = async (uid, data = {}, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/user/${uid}`, data, options)
    return response.data
}

const updatePost = async (pid, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/post/${pid}`, {}, options)
    return response.data
}




const adminService = { fetchAllUsers, fetchAllPosts, fetchAllReports, updateUser, updatePost }


export default adminService