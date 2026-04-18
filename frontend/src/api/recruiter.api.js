import client from "./client";
/**
 * Recruiter API Service
 */
const recruiterApi = {
  /**
   * Get dashboard data for recruiter
   */
  getDashboardData: async () => {
    const response = await client.get("/recruiter/dashboard");
    return response.data;
  },

  /**
   * Get all jobs posted by the recruiter
   */
  getMyJobs: async () => {
    const response = await client.get("/recruiter/jobs");
    return response.data;
  },

  /**
   * Get all applications for the recruiter
   */
  getMyApplications: async () => {
    const response = await client.get("/recruiter/applications");
    return response.data;
  },

  /**
   * Create a new job offer
   */
  createJob: async (data) => {
    const response = await client.post("/job-offers", data);
    return response.data;
  },

  /**
   * Update a job offer
   */
  updateJob: async (id, data) => {
    const response = await client.put(`/job-offers/${id}`, data);
    return response.data;
  },

  /**
   * Delete a job offer
   */
  deleteJob: async (id) => {
    const response = await client.delete(`/job-offers/${id}`);
    return response.data;
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (id, status) => {
    const response = await client.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  /**
   * Get contract types
   */
  getContractTypes: async () => {
    const response = await client.get("/job-offers/contract-types");
    return response.data;
  },
};

export default recruiterApi;
