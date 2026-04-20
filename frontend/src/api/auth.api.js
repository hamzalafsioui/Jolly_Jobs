import client from "./client";

/**
 * Authentication API methods | API service object
 */
const authApi = {
  login: async (credentials) => {
    const response = await client.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await client.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await client.post("/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  },

  getMe: async () => {
    const response = await client.get("/auth/me");
    return response.data;
  },

  getGoogleAuthUrl: async () => {
    const response = await client.get("/auth/google/url");
    return response.data;
  },

  googleCallback: async (params) => {
    const response = await client.post("/auth/google/callback", params);
    return response.data;
  },

  /**
   * Test connection to backend
   */
  testConnection: async () => {
    const response = await client.get("/test-connection");
    return response.data;
  },
};

export default authApi;
