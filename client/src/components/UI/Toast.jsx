import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function Toast({ message, type = 'success', onClose }) {
  const icons = { success: FiCheckCircle, error: FiAlertCircle };
  const colors = {
    success: 'border-accent-500 bg-accent-50 dark:bg-accent-900/20',
    error: 'border-danger-500 bg-danger-50 dark:bg-danger-900/20',
  };
  const Icon = icons[type] || FiCheckCircle;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border-l-4 shadow-xl shadow-black/10 ${colors[type]}`}
        >
          <Icon size={20} className={type === 'success' ? 'text-accent-500' : 'text-danger-500'} />
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors ml-2">
            <FiX size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
