import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (data) => api.post('/auth/signup', data);
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.put(`/auth/reset-password/${token}`, { password });
export const updateProfile = (data) => api.put('/auth/profile', data);
export const updatePassword = (currentPassword, newPassword) => api.put('/auth/update-password', { currentPassword, newPassword });
