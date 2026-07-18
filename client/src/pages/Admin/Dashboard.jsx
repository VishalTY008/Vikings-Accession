import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiUserPlus, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getAdminDashboard } from '../../services/dashboardService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import ChartCard from '../../components/Dashboard/ChartCard';
import Spinner from '../../components/UI/Spinner';

const COLORS = ['#4F46E5', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  const equipData = data?.equipmentStats?.map(e => ({ name: e._id, value: e.count })) || [];

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Admin Dashboard</h2>
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Members" value={data?.totalMembers || 0} icon={FiUsers} color="primary" />
          <StatCard title="Active Members" value={data?.activeMembers || 0} icon={FiUserCheck} color="accent" />
          <StatCard title="Trainers" value={data?.totalTrainers || 0} icon={FiUserPlus} color="secondary" />
          <StatCard title="Today's Attendance" value={data?.todayAttendance || 0} icon={FiCalendar} color="warning" />
        </motion.div>
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Member Growth">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.memberGrowth || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Equipment Status">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={equipData} cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => name + ': ' + value}>{equipData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
        <motion.div variants={staggerItem}>
          <ChartCard title="Daily Attendance">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.monthlyStats || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
