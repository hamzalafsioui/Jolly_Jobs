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
};

export default jobApi;
