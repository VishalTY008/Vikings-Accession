import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import api from '../../services/api';
import Toast from '../../components/UI/Toast';

export default function AdminReports() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '' });

  const downloadReport = async (type) => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url; link.download = `${type}-report.csv`;
      document.body.appendChild(link); link.click(); link.remove();
      setToast({ message: 'Report downloaded!', type: 'success' });
    } catch { setToast({ message: 'Failed to generate report', type: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'attendance', title: 'Attendance Report', desc: 'Daily, weekly, and monthly attendance data' },
            { type: 'members', title: 'Members Report', desc: 'All members with membership status' },
            { type: 'revenue', title: 'Revenue Report', desc: 'Revenue breakdown by membership type' },
            { type: 'trainers', title: 'Trainer Performance', desc: 'Trainer activity and member progress' },
            { type: 'equipment', title: 'Equipment Usage', desc: 'Equipment maintenance and usage stats' },
          ].map(r => (
            <motion.div key={r.type} variants={staggerItem} className="glass-card p-6">
              <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-gray-500 dark:text-dark-400 mb-4">{r.desc}</p>
              <Button onClick={() => downloadReport(r.type)} loading={loading} className="w-full">Download CSV</Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
