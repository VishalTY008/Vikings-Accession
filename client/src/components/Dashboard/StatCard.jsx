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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="stat-card"
    >
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
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[color]} text-white shadow-lg`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
