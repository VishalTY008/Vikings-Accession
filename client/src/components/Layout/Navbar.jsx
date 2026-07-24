import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiBell, FiMenu, FiX, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/10 dark:border-dark-700/50 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to={`/${user?.role}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <span className="text-white font-bold text-sm">FZ</span>
            </div>
            <span className="hidden sm:block font-display font-bold text-lg gradient-text">FitZone</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {darkMode ? <FiSun size={18} className="text-warning-400" /> : <FiMoon size={18} className="text-dark-500" />}
            </motion.div>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-lg"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20 dark:ring-dark-700/50">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              <FiChevronDown size={14} className={`hidden md:block transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-12 w-56 glass-card p-2 shadow-xl shadow-black/10"
                >
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-dark-700">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-400">{user?.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => { navigate(`/${user?.role}/profile`); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <FiUser size={16} /> Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    <FiLogOut size={16} /> Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
