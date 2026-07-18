import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiActivity, FiHeart, FiCalendar, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getMemberDashboard } from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import WelcomeCard from '../../components/Dashboard/WelcomeCard';
import WorkoutCard from '../../components/Workout/WorkoutCard';
import DietCard from '../../components/Diet/DietCard';
import ProgressChart from '../../components/Progress/ProgressChart';
import ChartCard from '../../components/Dashboard/ChartCard';
import Spinner from '../../components/UI/Spinner';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemberDashboard()
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={staggerItem}>
          <WelcomeCard user={user} />
        </motion.div>

        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Workouts This Week" value={data?.weeklyWorkouts || 0} icon={FiActivity} color="primary" />
          <StatCard title="Calories Burned" value={data?.caloriesBurned || 0} icon={FiHeart} color="danger" />
          <StatCard title="Attendance Streak" value={`${data?.streak || 0} days`} icon={FiCalendar} color="accent" />
          <StatCard title="Goals Completed" value={`${data?.goalsCompleted || 0}%`} icon={FiTrendingUp} color="success" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={staggerItem}>
            <ChartCard title="Progress Overview">
              <ProgressChart data={data?.recentProgress || []} />
            </ChartCard>
          </motion.div>
          <motion.div variants={staggerItem} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Today's Workout</h3>
              <Link to="/workouts" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">View All <FiArrowRight /></Link>
            </div>
            {data?.todayWorkout ? (
              <WorkoutCard workout={data.todayWorkout} compact />
            ) : (
              <div className="glass-card p-6 text-center text-gray-500 dark:text-dark-400">No workout scheduled today</div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Diet Plan</h3>
              <Link to="/diet" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">View All <FiArrowRight /></Link>
            </div>
            {data?.dietPlan ? (
              <DietCard plan={data.dietPlan} compact />
            ) : (
              <div className="glass-card p-6 text-center text-gray-500 dark:text-dark-400">No diet plan assigned</div>
            )}
          </motion.div>
          <motion.div variants={staggerItem}>
            <ChartCard title="Weekly Attendance">
              <ProgressChart data={data?.weeklyAttendance || []} dataKey="present" color="#22C55E" />
            </ChartCard>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
