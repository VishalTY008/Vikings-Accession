import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/UI/Spinner';

const Home = lazy(() => import('../pages/Public/Home'));
const Login = lazy(() => import('../pages/Public/Login'));
const Signup = lazy(() => import('../pages/Public/Signup'));
const ForgotPassword = lazy(() => import('../pages/Public/ForgotPassword'));

const MemberDashboard = lazy(() => import('../pages/Member/Dashboard'));
const MemberProfile = lazy(() => import('../pages/Member/Profile'));
const MemberWorkouts = lazy(() => import('../pages/Member/Workouts'));
const MemberDiet = lazy(() => import('../pages/Member/Diet'));
const MemberProgress = lazy(() => import('../pages/Member/Progress'));
const MemberAttendance = lazy(() => import('../pages/Member/Attendance'));
const MemberChat = lazy(() => import('../pages/Member/Chat'));
const MemberNotifications = lazy(() => import('../pages/Member/Notifications'));

const TrainerDashboard = lazy(() => import('../pages/Trainer/Dashboard'));
const TrainerMembers = lazy(() => import('../pages/Trainer/Members'));
const TrainerWorkoutPlans = lazy(() => import('../pages/Trainer/WorkoutPlans'));
const TrainerDietPlans = lazy(() => import('../pages/Trainer/DietPlans'));
const TrainerMemberProgress = lazy(() => import('../pages/Trainer/MemberProgress'));
const TrainerChat = lazy(() => import('../pages/Trainer/Chat'));

const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminMembers = lazy(() => import('../pages/Admin/Members'));
const AdminTrainers = lazy(() => import('../pages/Admin/Trainers'));
const AdminEquipment = lazy(() => import('../pages/Admin/Equipment'));
const AdminMemberships = lazy(() => import('../pages/Admin/Memberships'));
const AdminAttendance = lazy(() => import('../pages/Admin/Attendance'));
const AdminReports = lazy(() => import('../pages/Admin/Reports'));
const AdminNotifications = lazy(() => import('../pages/Admin/Notifications'));
const AdminSettings = lazy(() => import('../pages/Admin/Settings'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
      <Spinner size="lg" />
    </div>
  );
}

function DashboardRouter() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'admin': return <AdminDashboard />;
    case 'trainer': return <TrainerDashboard />;
    default: return <MemberDashboard />;
  }
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
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
      </Suspense>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  const { loading } = useAuth();
  if (loading) return <PageLoader />;

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
