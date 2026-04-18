import client from './client';

const messageApi = {
  /** GET /api/messages/unread-count */
  getUnreadCount: async () => {
    const response = await client.get('/messages/unread-count');
    return response.data;
  },

  /** GET /api/messages/conversations */
  getConversations: async () => {
    const response = await client.get('/messages/conversations');
    return response.data;
  },

  /** GET /api/messages/{userId} => full history */
  getMessages: async (userId) => {
    const response = await client.get(`/messages/${userId}`);
    return response.data;
  },

  /** POST /api/messages/{userId} => send a message */
  sendMessage: async (userId, content) => {
    const response = await client.post(`/messages/${userId}`, { content });
    return response.data;
  },

  /** PATCH /api/messages/{userId}/read => mark as read */
  markRead: async (userId) => {
    const response = await client.patch(`/messages/${userId}/read`);
    return response.data;
  },
};

export default messageApi;
