import API from "./client";

const profileApi = {
  /**
   * Fetch the complete profile for the authenticated user
   */
  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  /**
   * Update the authenticated user profile
   * Uses FormData to support file uploads (logo/cv)
   * headers is set to multipart/form-data automatically between browser-axios
   */
  updateProfile: async (formData) => {
    const response = await API.post("/auth/profile", formData);
    return response.data;
  },

  /**
   * Scan the user CV for skills
   */
  scanCv: async () => {
    const response = await API.post("/auth/profile/scan-cv");
    return response.data;
  },
};

export default profileApi;
