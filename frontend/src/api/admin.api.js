import client from "./client";

/**
 * Admin API methods
 */
const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  getStats: async () => {
    const response = await client.get("/admin/dashboard");
    return response.data;
  },

  /**
   * Get all users
   */
  getUsers: async () => {
    const response = await client.get("/users");
    return response.data;
  },

  /**
   * Update a user (change role, status)
   */
  updateUser: async (id, data) => {
    const response = await client.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  deleteUser: async (id) => {
    const response = await client.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Get all job offers for moderation
   */
  getJobs: async () => {
    const response = await client.get("/job-offers");
    return response.data;
  },

  /**
   * Delete a job offer
   */
  deleteJob: async (id) => {
    const response = await client.delete(`/job-offers/${id}`);
    return response.data;
  },
};

export default adminApi;
