import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';
import api from '../../services/api';

export default function AdminEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ name: '', category: 'strength', quantity: 1, available: 1, status: 'available' });

  const fetchEq = () => { api.get('/equipment').then(r => setEquipment(r.data.data.equipment || r.data.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetchEq(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await api.post('/equipment', form); setModal(false); fetchEq(); setToast({ message: 'Added!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return; await api.delete('/equipment/' + id); fetchEq(); setToast({ message: 'Deleted', type: 'success' });
  };

  const statusColors = { available: 'success', maintenance: 'warning', retired: 'danger' };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Equipment</h2>
          <Button onClick={() => setModal(true)}>Add Equipment</Button>
        </div>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-dark-700">
              <th className="text-left p-4 font-medium text-gray-500">Name</th>
              <th className="text-left p-4 font-medium text-gray-500">Category</th>
              <th className="text-left p-4 font-medium text-gray-500">Qty</th>
              <th className="text-left p-4 font-medium text-gray-500">Available</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
              <th className="text-right p-4 font-medium text-gray-500">Action</th>
            </tr></thead>
            <tbody>{equipment.map(e => (
              <motion.tr key={e._id} variants={staggerItem} className="border-b border-gray-50 dark:border-dark-700">
                <td className="p-4 font-medium">{e.name}</td>
                <td className="p-4 capitalize">{e.category}</td>
                <td className="p-4">{e.quantity}</td>
                <td className="p-4">{e.available}</td>
                <td className="p-4"><Badge variant={statusColors[e.status]}>{e.status}</Badge></td>
                <td className="p-4 text-right"><Button variant="danger" size="sm" onClick={() => handleDelete(e._id)}>Delete</Button></td>
              </motion.tr>
            ))}</tbody>
          </table>
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Equipment">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['cardio', 'strength', 'flexibility', 'functional', 'accessories'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
              <Input label="Available" type="number" value={form.available} onChange={e => setForm({ ...form, available: Number(e.target.value) })} />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
