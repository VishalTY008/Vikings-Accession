import { motion } from 'framer-motion';

const variants = {
  primary: 'gradient-bg text-white hover:shadow-lg hover:shadow-primary-500/25',
  secondary: 'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 hover:shadow-lg hover:shadow-danger-500/25',
  success: 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 hover:shadow-lg hover:shadow-warning-500/25',
  ghost: 'text-gray-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export default function Button({ variant = 'primary', size = 'md', children, className = '', loading = false, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 relative overflow-hidden ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </motion.button>
  );
}
