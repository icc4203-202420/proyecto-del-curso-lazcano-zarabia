import axios from 'axios';

const NGROK_URL = 'https://7818-186-10-205-114.ngrok-free.app';

// Crea una instancia de axios con la URL base y el encabezado de advertencia de ngrok
const axiosInstance = axios.create({
  baseURL: NGROK_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true', // Añade este encabezado
  },
});

export default axiosInstance;
