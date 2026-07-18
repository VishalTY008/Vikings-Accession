import { motion } from 'framer-motion';
import { FiMail, FiMessageCircle, FiBell, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationCard({ notification }) {
  const { markAsRead } = useNotifications();
  const icons = { email: FiMail, sms: FiMessageCircle, 'in-app': FiBell };
  const Icon = icons[notification.type] || FiBell;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
        notification.read ? 'bg-white dark:bg-dark-800' : 'bg-primary-50/50 dark:bg-primary-900/10'
      }`}
    >
      <div className={`p-2 rounded-lg ${notification.read ? 'bg-gray-100 dark:bg-dark-700' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
        <Icon size={16} className={notification.read ? 'text-gray-500' : 'text-primary-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${!notification.read ? 'text-dark-900 dark:text-white' : 'text-gray-600 dark:text-dark-400'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">{notification.body}</p>
      </div>
      {!notification.read && (
        <button onClick={() => markAsRead(notification._id)} className="p-1 rounded-lg hover:bg-white dark:hover:bg-dark-700 transition-colors">
          <FiCheck size={14} className="text-accent-500" />
        </button>
      )}
    </motion.div>
  );
}
