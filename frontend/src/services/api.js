import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login/', credentials);
export const register = (userData) => api.post('/auth/register/', userData);
export const getCurrentUser = () => api.get('/auth/user/');

// Profile APIs
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.patch('/profile/', data);

// Crop APIs
export const getCrops = () => api.get('/crops/');
export const createCrop = (data) => api.post('/crops/', data);
export const updateCrop = (id, data) => api.patch(`/crops/${id}/`, data);
export const deleteCrop = (id) => api.delete(`/crops/${id}/`);

// Weather API
export const getWeather = (location) => api.get(`/weather/?location=${location}`);

// Crop Suggestions API
export const getCropSuggestions = (crop) => {
  if (crop) {
    return api.get(`/suggestions/?crop=${crop}`);
  }
  return api.get('/suggestions/');
};

// Chatbot API
export const sendChatMessage = (message) => api.post('/chatbot/', { message });

export default api;
