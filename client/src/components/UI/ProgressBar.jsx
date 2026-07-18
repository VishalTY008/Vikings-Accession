import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, max = 100, color = 'primary', className = '' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
    danger: 'from-danger-500 to-danger-600',
    warning: 'from-warning-500 to-warning-600',
  };

  return (
    <div className={`w-full bg-gray-100 dark:bg-dark-700 rounded-full h-2.5 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
      />
    </div>
  );
}
