import axios from 'axios';

export const apipms = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});