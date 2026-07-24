import { motion } from 'framer-motion';
import AnimatedCounter from '../UI/AnimatedCounter';

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', suffix = '' }) {
  const gradients = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
    danger: 'from-danger-500 to-danger-600',
    warning: 'from-warning-500 to-warning-600',
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 40px -12px rgba(99, 102, 241, 0.1)` }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="stat-card relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
      />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-dark-400">{title}</p>
          <p className="text-3xl font-display font-bold">
            <AnimatedCounter end={typeof value === 'number' ? value : 0} suffix={suffix} />
          </p>
          {trend && (
            <p className={`text-xs font-medium ${trend > 0 ? 'text-accent-500' : 'text-danger-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[color]} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
