import axiosInstance from "../../config/axiosConfig"

const API_URL = "/api/auth"


const register = async (formData) => {
    const response = await axiosInstance.post(API_URL + "/register", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    console.log(response)
    return response.data
}

const login = async (formData) => {
    const response = await axiosInstance.post(API_URL + "/login", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}



const authService = { register, login }

export default authService