import axios from "axios";

/**
 * Base axios instance
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api",
  timeout: 15000, // 15 sec for waiting
  headers: {
    Accept: "application/json",
  },
});

/**
 * Request Interceptor | attach Auth Token before every request
 */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor | handle global errors
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // On 429 Too Many Requests (rate limit)
    if (error.response?.status === 429) {
      return Promise.reject(
        new Error("Too many requests. Please wait a moment and try again.")
      );
    }

    return Promise.reject(error);
  }
);

export default client;
