import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getDietPlans, createDietPlan } from '../../services/workoutService';
import { getAssignedMembers } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';
import api from '../../services/api';

export default function TrainerDietPlans() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ member: '', name: '', meals: [{ type: 'breakfast', items: [''], calories: 0, protein: 0, carbs: 0, fats: 0 }] });

  useEffect(() => {
    Promise.all([api.get('/diets'), getAssignedMembers()])
      .then(([d, m]) => { setPlans(d.data.data.plans || d.data.data); setMembers(m.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await createDietPlan(form); setModal(false); setToast({ message: 'Diet plan created!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Diet Plans</h2>
          <Button onClick={() => setModal(true)}>Create Plan</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <motion.div key={p._id} variants={staggerItem} className="glass-card p-5">
              <h4 className="font-bold">{p.name}</h4>
              <p className="text-sm text-gray-500 dark:text-dark-400">{p.totalCalories} kcal &bull; {p.meals?.length} meals</p>
            </motion.div>
          ))}
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Create Diet Plan" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select className="input-field" value={form.member} onChange={e => setForm({ ...form, member: e.target.value })} required>
              <option value="">Select Member</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.user?.name}</option>)}
            </select>
            <Input label="Plan Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Button type="submit">Create</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
