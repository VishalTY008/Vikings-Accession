import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getMyProgress, logProgress } from '../../services/memberService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ProgressChart from '../../components/Progress/ProgressChart';
import ChartCard from '../../components/Dashboard/ChartCard';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function MemberProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', notes: '' });

  useEffect(() => {
    getMyProgress().then(res => setProgress(res.data.data.progress || res.data.data)).finally(() => setLoading(false));
  }, []);

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      await logProgress(form);
      const res = await getMyProgress();
      setProgress(res.data.data.progress || res.data.data);
      setModal(false);
      setForm({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', notes: '' });
      setToast({ message: 'Progress logged!', type: 'success' });
    } catch {
      setToast({ message: 'Failed', type: 'error' });
    }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">My Progress</h2>
          <Button onClick={() => setModal(true)}>Log Progress</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={staggerItem}>
            <ChartCard title="Weight Trend"><ProgressChart data={progress} dataKey="weight" color="#4F46E5" /></ChartCard>
          </motion.div>
          <motion.div variants={staggerItem}>
            <ChartCard title="Body Fat Trend"><ProgressChart data={progress} dataKey="bodyFat" color="#EF4444" /></ChartCard>
          </motion.div>
        </div>
        <motion.div variants={staggerItem}>
          <ChartCard title="Measurements"><ProgressChart data={progress} dataKey="chest" color="#06B6D4" /></ChartCard>
        </motion.div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Log Progress">
          <form onSubmit={handleLog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Weight (kg)" type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
              <Input label="Body Fat %" type="number" step="0.1" value={form.bodyFat} onChange={e => setForm({ ...form, bodyFat: e.target.value })} />
              <Input label="Chest (cm)" type="number" value={form.chest} onChange={e => setForm({ ...form, chest: e.target.value })} />
              <Input label="Waist (cm)" type="number" value={form.waist} onChange={e => setForm({ ...form, waist: e.target.value })} />
              <Input label="Hips (cm)" type="number" value={form.hips} onChange={e => setForm({ ...form, hips: e.target.value })} />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
