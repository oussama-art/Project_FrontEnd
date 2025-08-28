import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});
// si un token existe, on l’ajoute automatiquement
const token = localStorage.getItem('token')
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default apiClient;
