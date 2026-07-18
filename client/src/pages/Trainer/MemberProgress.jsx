import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getAssignedMembers, getMemberProgress } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ProgressChart from '../../components/Progress/ProgressChart';
import ChartCard from '../../components/Dashboard/ChartCard';
import Spinner from '../../components/UI/Spinner';

export default function TrainerMemberProgress() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAssignedMembers().then(r => setMembers(r.data.data)).finally(() => setLoading(false)); }, []);

  const selectMember = async (m) => {
    setSelected(m);
    const res = await getMemberProgress(m._id);
    setProgress(res.data.data.progress || []);
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Member Progress</h2>
        <div className="flex gap-2 flex-wrap">
          {members.map(m => (
            <button key={m._id} onClick={() => selectMember(m)} className={'px-4 py-2 rounded-xl text-sm font-medium transition-all ' + (selected?._id === m._id ? 'gradient-bg text-white' : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200')}>{m.user?.name}</button>
          ))}
        </div>
        {selected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={staggerItem}><ChartCard title="Weight"><ProgressChart data={progress} dataKey="weight" color="#4F46E5" /></ChartCard></motion.div>
            <motion.div variants={staggerItem}><ChartCard title="Body Fat"><ProgressChart data={progress} dataKey="bodyFat" color="#EF4444" /></ChartCard></motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
