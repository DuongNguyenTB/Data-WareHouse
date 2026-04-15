import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Tự động gắn Token từ localStorage vào Header Authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;