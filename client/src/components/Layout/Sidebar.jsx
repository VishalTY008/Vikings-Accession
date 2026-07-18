import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUsers, FiUserPlus, FiActivity, FiHeart, FiCalendar,
  FiMessageCircle, FiBell, FiBarChart2, FiSettings, FiTool, FiCreditCard,
  FiClipboard, FiTarget, FiTrendingUp,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const memberLinks = [
  { to: '/member', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/member/workouts', icon: FiActivity, label: 'Workouts' },
  { to: '/member/diet', icon: FiHeart, label: 'Diet Plan' },
  { to: '/member/progress', icon: FiTrendingUp, label: 'Progress' },
  { to: '/member/attendance', icon: FiCalendar, label: 'Attendance' },
  { to: '/member/chat', icon: FiMessageCircle, label: 'Chat' },
  { to: '/member/notifications', icon: FiBell, label: 'Notifications' },
];

const trainerLinks = [
  { to: '/trainer', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/trainer/members', icon: FiUsers, label: 'Members' },
  { to: '/trainer/workouts', icon: FiActivity, label: 'Workout Plans' },
  { to: '/trainer/diets', icon: FiHeart, label: 'Diet Plans' },
  { to: '/trainer/progress', icon: FiTarget, label: 'Member Progress' },
  { to: '/trainer/chat', icon: FiMessageCircle, label: 'Chat' },
];

const adminLinks = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/admin/members', icon: FiUsers, label: 'Members' },
  { to: '/admin/trainers', icon: FiUserPlus, label: 'Trainers' },
  { to: '/admin/equipment', icon: FiTool, label: 'Equipment' },
  { to: '/admin/memberships', icon: FiCreditCard, label: 'Memberships' },
  { to: '/admin/attendance', icon: FiClipboard, label: 'Attendance' },
  { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
  { to: '/admin/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : user?.role === 'trainer' ? trainerLinks : memberLinks;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-700 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100 dark:border-dark-700">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Activity className="text-white" size={18} />
          </div>
          <span className="font-display font-bold text-lg gradient-text">FitZone</span>
        </div>

        <div className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-800 hover:text-primary-600'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-dark-700">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-dark-400">Logged in as</p>
            <p className="text-sm font-semibold capitalize">{user?.role}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Activity({ className, size }) {
  return <FiActivity className={className} size={size} />;
}
