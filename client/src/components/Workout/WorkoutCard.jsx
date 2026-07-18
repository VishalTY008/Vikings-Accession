import { motion } from 'framer-motion';
import { FiClock, FiRepeat, FiCheck, FiActivity } from 'react-icons/fi';
import Badge from '../UI/Badge';

export default function WorkoutCard({ workout, onComplete }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display font-bold text-lg">{workout.name}</h4>
          <p className="text-sm text-gray-500 dark:text-dark-400 capitalize">{workout.day}</p>
        </div>
        <Badge variant={workout.isCompleted ? 'success' : 'info'}>
          {workout.isCompleted ? 'Completed' : 'Pending'}
        </Badge>
      </div>

      <div className="space-y-2">
        {workout.exercises?.slice(0, 4).map((ex, i) => (
          <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 dark:border-dark-700 last:border-0">
            <span className="flex items-center gap-2">
              <FiActivity size={14} className="text-primary-500" />
              {ex.name}
            </span>
            <span className="text-gray-500 dark:text-dark-400">{ex.sets}x{ex.reps}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-400">
        <span className="flex items-center gap-1"><FiClock size={14} /> {workout.duration || 45}min</span>
        <span className="flex items-center gap-1"><FiRepeat size={14} /> {workout.exercises?.length || 0} exercises</span>
      </div>

      {!workout.isCompleted && onComplete && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onComplete(workout._id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400 font-semibold text-sm hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors"
        >
          <FiCheck size={16} /> Mark Complete
        </motion.button>
      )}
    </motion.div>
  );
}
