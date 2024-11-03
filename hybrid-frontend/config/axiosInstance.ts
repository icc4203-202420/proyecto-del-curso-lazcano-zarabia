import axios from 'axios';

const NGROK_URL = 'https://7818-186-10-205-114.ngrok-free.app';

const axiosInstance = axios.create({
  baseURL: NGROK_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true', 
  },
});

export default axiosInstance;
