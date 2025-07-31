import axios from 'axios';

export const apipms = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// apipms.js
apipms.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

