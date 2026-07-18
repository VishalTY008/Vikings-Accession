import api from './api';

export const getTrainers = (params) => api.get('/trainers', { params });
export const getTrainer = (id) => api.get(`/trainers/${id}`);
export const createTrainer = (data) => api.post('/trainers', data);
export const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data);
export const deleteTrainer = (id) => api.delete(`/trainers/${id}`);
export const getTrainerDashboard = () => api.get('/trainers/dashboard');
export const getAssignedMembers = () => api.get('/trainers/my-members');
export const getMemberProgress = (memberId) => api.get(`/trainers/member-progress/${memberId}`);
