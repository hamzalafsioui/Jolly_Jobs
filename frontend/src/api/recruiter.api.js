import client from "./client";

/**
 * Recruiter API service
 */
const recruiterApi = {
  /**
   * Get recruiter dashboard statistics and data
   */
  getDashboardData: async () => {
    try {
      const response = await client.get("/recruiter/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching recruiter dashboard data:", error);
      throw error;
    }
  },
};

export default recruiterApi;
