import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/user",
  // withCredentials: true, // Uncomment if using cookies/session auth
});

export const googleAuth = (code) => api.post("/google", { code });
