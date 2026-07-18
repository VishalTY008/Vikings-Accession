import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getTrainers, createTrainer, deleteTrainer } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Avatar from '../../components/UI/Avatar';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', specialization: '', experience: 0 });

  const fetchTrainers = () => {
    getTrainers().then(r => setTrainers(r.data.data.trainers || r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrainers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTrainer({ ...form, specialization: form.specialization.split(',').map(s => s.trim()) });
      setModal(false); fetchTrainers(); setToast({ message: 'Trainer added!', type: 'success' });
    } catch (err) { setToast({ message: err.response?.data?.message || 'Failed', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await deleteTrainer(id); fetchTrainers(); setToast({ message: 'Deleted', type: 'success' });
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Trainers</h2>
          <Button onClick={() => setModal(true)}>Add Trainer</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map(t => (
            <motion.div key={t._id} variants={staggerItem} whileHover={{ y: -4 }} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={t.user?.name} src={t.user?.profileImage} />
                <div><p className="font-semibold">{t.user?.name}</p><p className="text-xs text-gray-500 dark:text-dark-400">{t.user?.email}</p></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Experience</span><span>{t.experience} years</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Members</span><Badge>{t.assignedMembers?.length || 0}</Badge></div>
                <div className="flex gap-1 flex-wrap">{t.specialization?.map(s => <Badge key={s} variant="primary" className="text-[10px]">{s}</Badge>)}</div>
              </div>
              <Button variant="danger" size="sm" className="mt-3 w-full" onClick={() => handleDelete(t._id)}>Remove</Button>
            </motion.div>
          ))}
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Trainer">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <Input label="Specialization (comma separated)" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
            <Input label="Experience (years)" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: Number(e.target.value) })} />
            <Button type="submit">Create</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
