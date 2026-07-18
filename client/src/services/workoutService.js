import api from './api';

export const getWorkouts = (params) => api.get('/workouts', { params });
export const getMyWorkouts = (params) => api.get('/workouts/my', { params });
export const createWorkout = (data) => api.post('/workouts', data);
export const updateWorkout = (id, data) => api.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
export const markComplete = (id) => api.put(`/workouts/${id}/complete`);
export const getDietPlans = (params) => api.get('/diets', { params });
export const createDietPlan = (data) => api.post('/diets', data);
export const updateDietPlan = (id, data) => api.put(`/diets/${id}`, data);
export const deleteDietPlan = (id) => api.delete(`/diets/${id}`);
export const logWorkout = (id) => api.post(`/workouts/${id}/log`);
