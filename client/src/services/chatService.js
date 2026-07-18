import api from './api';

export const getChatList = () => api.get('/messages/chat-list');
export const getConversation = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (data) => api.post('/messages', data);
export const markRead = (userId) => api.put(`/messages/read/${userId}`);
export const getUnreadCount = () => api.get('/messages/unread');
