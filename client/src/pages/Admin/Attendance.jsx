import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Badge from '../../components/UI/Badge';
import Spinner from '../../components/UI/Spinner';
import api from '../../services/api';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setLoading(true);
    api.get(`/attendance?date=${date}`).then(r => setRecords(r.data.data.attendance || r.data.data)).finally(() => setLoading(false));
  }, [date]);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Attendance</h2>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        </div>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-dark-700">
              <th className="text-left p-4 font-medium text-gray-500">Member</th>
              <th className="text-left p-4 font-medium text-gray-500">Check In</th>
              <th className="text-left p-4 font-medium text-gray-500">Check Out</th>
              <th className="text-left p-4 font-medium text-gray-500">Duration</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
            </tr></thead>
            <tbody>{records.map(r => (
              <motion.tr key={r._id} variants={staggerItem} className="border-b border-gray-50 dark:border-dark-700">
                <td className="p-4 font-medium">{r.member?.user?.name || r.member?.name}</td>
                <td className="p-4">{r.checkIn?.slice(0, 5) || '-'}</td>
                <td className="p-4">{r.checkOut?.slice(0, 5) || '-'}</td>
                <td className="p-4">{r.duration ? `${r.duration} min` : '-'}</td>
                <td className="p-4"><Badge variant={r.status === 'present' ? 'success' : r.status === 'late' ? 'warning' : 'danger'}>{r.status}</Badge></td>
              </motion.tr>
            ))}</tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
