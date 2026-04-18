import client from './client';
/**
 * Notification API Service
 */
const notificationApi = {
  /** GET /api/notifications */
  getNotifications: async () => {
    const response = await client.get('/notifications');
    return response.data;
  },

  /** PATCH /api/notifications/read-all */
  markAllRead: async () => {
    const response = await client.patch('/notifications/read-all');
    return response.data;
  },

  /** PATCH /api/notifications/{id}/read */
  markRead: async (id) => {
    const response = await client.patch(`/notifications/${id}/read`);
    return response.data;
  },
};

export default notificationApi;
