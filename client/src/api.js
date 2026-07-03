import axios from 'axios';

// In development, Vite's proxy (see vite.config.js) forwards "/api" to the
// Express server, so this relative base URL works out of the box.
// In production, set VITE_API_URL to your deployed API's base URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

export default api;
