import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getMembers, createMember, deleteMember } from '../../services/memberService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import SearchBar from '../../components/UI/SearchBar';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Avatar from '../../components/UI/Avatar';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', membershipType: 'basic' });

  const fetchMembers = (search = '') => {
    getMembers({ search }).then(r => setMembers(r.data.data.members || r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createMember(form); setModal(false); fetchMembers(); setToast({ message: 'Member created!', type: 'success' }); }
    catch (err) { setToast({ message: err.response?.data?.message || 'Failed', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    await deleteMember(id); fetchMembers(); setToast({ message: 'Member deleted', type: 'success' });
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Members</h2>
          <Button onClick={() => setModal(true)}>Add Member</Button>
        </div>
        <SearchBar onSearch={s => fetchMembers(s)} placeholder="Search members..." className="max-w-sm" />
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 dark:border-dark-700">
                <th className="text-left p-4 font-medium text-gray-500">Member</th>
                <th className="text-left p-4 font-medium text-gray-500">Membership</th>
                <th className="text-left p-4 font-medium text-gray-500">Weight</th>
                <th className="text-left p-4 font-medium text-gray-500">Expires</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr></thead>
              <tbody>
                {members.map(m => (
                  <motion.tr key={m._id} variants={staggerItem} className="border-b border-gray-50 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800">
                    <td className="p-4"><div className="flex items-center gap-3"><Avatar name={m.user?.name} src={m.user?.profileImage} size="sm" /><div><p className="font-medium">{m.user?.name}</p><p className="text-xs text-gray-500 dark:text-dark-400">{m.user?.email}</p></div></div></td>
                    <td className="p-4"><Badge variant="info" className="capitalize">{m.membershipType}</Badge></td>
                    <td className="p-4">{m.weight || '-'} kg</td>
                    <td className="p-4">{new Date(m.membershipEnd).toLocaleDateString()}</td>
                    <td className="p-4"><Badge variant={new Date(m.membershipEnd) > new Date() ? 'success' : 'danger'}>{new Date(m.membershipEnd) > new Date() ? 'Active' : 'Expired'}</Badge></td>
                    <td className="p-4 text-right"><Button variant="danger" size="sm" onClick={() => handleDelete(m._id)}>Delete</Button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Member">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <select className="input-field" value={form.membershipType} onChange={e => setForm({ ...form, membershipType: e.target.value })}>
              <option value="basic">Basic</option><option value="standard">Standard</option><option value="premium">Premium</option>
            </select>
            <Button type="submit">Create</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
