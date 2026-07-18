import api from './api';

export const getAdminDashboard = () => api.get('/dashboard/admin');
export const getEquipmentStats = () => api.get('/equipment/stats');
export const getAttendanceStats = () => api.get('/attendance/stats');
