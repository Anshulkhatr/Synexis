import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401, it means the token is invalid, expired, or the user is banned
      localStorage.removeItem('user');
      window.location.replace('/');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
