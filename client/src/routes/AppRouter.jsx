import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/UI/Spinner';

import Home from '../pages/Public/Home';
import Login from '../pages/Public/Login';
import Signup from '../pages/Public/Signup';
import ForgotPassword from '../pages/Public/ForgotPassword';

import MemberDashboard from '../pages/Member/Dashboard';
import MemberProfile from '../pages/Member/Profile';
import MemberWorkouts from '../pages/Member/Workouts';
import MemberDiet from '../pages/Member/Diet';
import MemberProgress from '../pages/Member/Progress';
import MemberAttendance from '../pages/Member/Attendance';
import MemberChat from '../pages/Member/Chat';
import MemberNotifications from '../pages/Member/Notifications';

import TrainerDashboard from '../pages/Trainer/Dashboard';
import TrainerMembers from '../pages/Trainer/Members';
import TrainerWorkoutPlans from '../pages/Trainer/WorkoutPlans';
import TrainerDietPlans from '../pages/Trainer/DietPlans';
import TrainerMemberProgress from '../pages/Trainer/MemberProgress';
import TrainerChat from '../pages/Trainer/Chat';

import AdminDashboard from '../pages/Admin/Dashboard';
import AdminMembers from '../pages/Admin/Members';
import AdminTrainers from '../pages/Admin/Trainers';
import AdminEquipment from '../pages/Admin/Equipment';
import AdminMemberships from '../pages/Admin/Memberships';
import AdminAttendance from '../pages/Admin/Attendance';
import AdminReports from '../pages/Admin/Reports';
import AdminNotifications from '../pages/Admin/Notifications';
import AdminSettings from '../pages/Admin/Settings';

function DashboardRouter() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'admin': return <AdminDashboard />;
    case 'trainer': return <TrainerDashboard />;
    default: return <MemberDashboard />;
  }
}

export default function AppRouter() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MemberProfile /></ProtectedRoute>} />

        <Route path="/workouts" element={<ProtectedRoute roles={['member']}><MemberWorkouts /></ProtectedRoute>} />
        <Route path="/diet" element={<ProtectedRoute roles={['member']}><MemberDiet /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute roles={['member']}><MemberProgress /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><MemberAttendance /></ProtectedRoute>} />

        <Route path="/chat" element={<ProtectedRoute><MemberChat /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MemberNotifications /></ProtectedRoute>} />

        <Route path="/trainer/members" element={<ProtectedRoute roles={['trainer']}><TrainerMembers /></ProtectedRoute>} />
        <Route path="/trainer/workouts" element={<ProtectedRoute roles={['trainer']}><TrainerWorkoutPlans /></ProtectedRoute>} />
        <Route path="/trainer/diets" element={<ProtectedRoute roles={['trainer']}><TrainerDietPlans /></ProtectedRoute>} />
        <Route path="/trainer/progress" element={<ProtectedRoute roles={['trainer']}><TrainerMemberProgress /></ProtectedRoute>} />
        <Route path="/trainer/chat" element={<ProtectedRoute roles={['trainer']}><TrainerChat /></ProtectedRoute>} />

        <Route path="/admin/members" element={<ProtectedRoute roles={['admin']}><AdminMembers /></ProtectedRoute>} />
        <Route path="/admin/trainers" element={<ProtectedRoute roles={['admin']}><AdminTrainers /></ProtectedRoute>} />
        <Route path="/admin/equipment" element={<ProtectedRoute roles={['admin']}><AdminEquipment /></ProtectedRoute>} />
        <Route path="/admin/memberships" element={<ProtectedRoute roles={['admin']}><AdminMemberships /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute roles={['admin']}><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute roles={['admin']}><AdminNotifications /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
