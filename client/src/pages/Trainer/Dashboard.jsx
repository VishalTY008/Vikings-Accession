import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getTrainerDashboard } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import ChartCard from '../../components/Dashboard/ChartCard';
import Spinner from '../../components/UI/Spinner';

export default function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrainerDashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Trainer Dashboard</h2>
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Members" value={data?.totalMembers || 0} icon={FiUsers} color="primary" />
          <StatCard title="Active Plans" value={data?.activePlans || 0} icon={FiActivity} color="accent" />
          <StatCard title="Member Attendance" value={`${data?.attendanceRate || 0}%`} icon={FiCalendar} color="success" />
          <StatCard title="Avg Progress" value={`${data?.avgProgress || 0}%`} icon={FiTrendingUp} color="secondary" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <ChartCard title="Member Attendance This Week">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.weeklyAttendance || []}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
