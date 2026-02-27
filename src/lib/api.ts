// API client for NutriSight Backend
const BASE_URL = "http://localhost:5000/api";

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface ApiError {
  message: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("nutrisight_token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).message || "Something went wrong");
  }

  return data as T;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};
