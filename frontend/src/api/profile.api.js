import API from "./client";

const profileApi = {
    /**
     * Fetch the complete profile for the authenticated user
     */
    getProfile: async () => {
        try {
            const response = await API.get("/auth/profile");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update the authenticated user profile
     * Uses FormData to support file uploads (logo/cv)
     */
    updateProfile: async (formData) => {
        try {
            const response = await API.post("/auth/profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default profileApi;
