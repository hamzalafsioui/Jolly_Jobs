import client from "./client";

/**
 * Job API service
 */
const jobApi = {
  /**
   * Get all available contract types
   */
  getContractTypes: async () => {
    try {
      const response = await client.get("/job-offers/contract-types");
      return response.data;
    } catch (error) {
      console.error("Error fetching contract types:", error);
      throw error;
    }
  },

  /**
   * Get job title suggestions based on query
   */
  getJobTitleSuggestions: async (query = "") => {
    try {
      const response = await client.get(`/job-offers/job-title-suggestions?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job title suggestions:", error);
      throw error;
    }
  },

  /**
   * Get cities matching a query
   */
  getCities: async (query = "") => {
    try {
      const response = await client.get(`/cities?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  },

  /**
   * Get latest job offers
   */
  getLatest: async (limit = 10) => {
    try {
      const response = await client.get(`/job-offers/latest?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest jobs:", error);
      throw error;
    }
  },

  /**
   * Search for job offers based on filters
   */
  search: async (filters = {}) => {
    try {
      const response = await client.get("/job-offers", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  /**
   * Get specific job offer details
   */
  getOfferDetails: async (id) => {
    try {
      const response = await client.get(`/job-offers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },

  /**
   * Toggle save state for a job offer
   */
  toggleSave: async (id) => {
    try {
      const response = await client.post(`/job-offers/${id}/save`);
      return response.data;
    } catch (error) {
      console.error("Error toggling saved job:", error);
      throw error;
    }
  },

  /**
   * Get all saved jobs for current user
   */
  getSavedJobs: async (page = 1, limit = 15) => {
    try {
      const response = await client.get(`/user/saved-jobs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      throw error;
    }
  },

  /**
   * Apply for a job offer
   */
  apply: async (jobId, data = {}) => {
    try {
      const response = await client.post(`/applications/apply/${jobId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      throw error;
    }
  },
};

export default jobApi;
