import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("session_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(payload) {
  return api.post("/auth/login", payload);
}

export async function signupUser(payload) {
  return api.post("/auth/signup", payload);
}

export async function updateUserSettings(payload) {
  return api.put("/users/me", payload);
}

export async function getUserById(userId) {
  return api.get(`/users/${userId}`);
}

export async function generatePlan(payload) {
  return api.post("/plan/generate", payload);
}

export async function regeneratePlan(payload) {
  return api.post("/plan/regenerate", payload);
}

export default api;
