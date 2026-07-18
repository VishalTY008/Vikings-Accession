import { motion } from 'framer-motion';
import { FiSunrise, FiSun, FiMoon, FiCoffee } from 'react-icons/fi';

const mealIcons = { breakfast: FiSunrise, lunch: FiSun, dinner: FiMoon, snacks: FiCoffee };

export default function DietCard({ meal }) {
  const Icon = mealIcons[meal.type] || FiCoffee;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
          <Icon size={18} className="text-primary-500" />
        </div>
        <div>
          <h4 className="font-display font-bold capitalize">{meal.type}</h4>
          <p className="text-xs text-gray-500 dark:text-dark-400">{meal.calories} kcal</p>
        </div>
      </div>

      <ul className="space-y-1">
        {meal.items?.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 dark:text-dark-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex gap-3 text-xs text-gray-500 dark:text-dark-400 pt-2 border-t border-gray-100 dark:border-dark-700">
        <span>P: {meal.protein}g</span>
        <span>C: {meal.carbs}g</span>
        <span>F: {meal.fats}g</span>
      </div>
    </motion.div>
  );
}
