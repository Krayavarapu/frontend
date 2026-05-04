import axios from "axios";

/** Default for auth and short calls (ms). */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Plan generation can exceed typical REST latency (OpenAI + DB). Keep above
 * backend PLAN_GENERATION_TIMEOUT_SECONDS + buffer. Override with
 * VITE_PLAN_REQUEST_TIMEOUT_MS in .env if needed.
 */
const PLAN_REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_PLAN_REQUEST_TIMEOUT_MS) || 180000;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: DEFAULT_TIMEOUT_MS,
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
  return api.post("/plan/generate", payload, { timeout: PLAN_REQUEST_TIMEOUT_MS });
}

export async function regeneratePlan(payload) {
  return api.post("/plan/regenerate", payload, { timeout: PLAN_REQUEST_TIMEOUT_MS });
}

export async function getActivePlan() {
  return api.get("/plan/active");
}

export default api;
