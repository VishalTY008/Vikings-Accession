import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getWorkouts, logWorkout } from '../../services/workoutService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import WorkoutCard from '../../components/Workout/WorkoutCard';
import SearchBar from '../../components/UI/SearchBar';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function MemberWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '' });

  const fetchWorkouts = (search = '') => {
    getWorkouts({ search }).then(res => setWorkouts(res.data.data.workouts || res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleLog = async (workoutId) => {
    try {
      await logWorkout(workoutId);
      setToast({ message: 'Workout logged!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to log', type: 'error' });
    }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Workouts</h2>
        </div>
        <SearchBar onSearch={fetchWorkouts} placeholder="Search workouts..." className="max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map(w => (
            <motion.div key={w._id} variants={staggerItem}>
              <WorkoutCard workout={w} onLog={() => handleLog(w._id)} />
            </motion.div>
          ))}
        </div>
        {workouts.length === 0 && <p className="text-center text-gray-500 dark:text-dark-400 py-10">No workouts available</p>}
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
