import axios from 'axios';

// ESTA ES LA LÍNEA MÁGICA
// 1. Lee la variable de entorno 'REACT_APP_API_URL' que ponemos en Render.
// 2. Si no la encuentra (porque estás en tu PC), usa 'http://localhost:4000/api'
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Esta parte es super útil para el futuro:
  Automáticamente añade el "Token" de seguridad a CADA
  petición que hagas después de iniciar sesión.
*/
api.interceptors.request.use(
  (config) => {
    // Asumo que guardas el token en localStorage después del login
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;