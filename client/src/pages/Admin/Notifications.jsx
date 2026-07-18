import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import NotificationCard from '../../components/Notifications/NotificationCard';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';
import api from '../../services/api';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ title: '', message: '', type: 'general', target: 'all' });

  const fetchNotifications = () => {
    api.get('/notifications').then(r => setNotifications(r.data.data.notifications || r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try { await api.post('/notifications/send', form); setModal(false); fetchNotifications(); setToast({ message: 'Notification sent!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Notifications</h2>
          <Button onClick={() => setModal(true)}>Send Notification</Button>
        </div>
        <div className="space-y-3">
          {notifications.map(n => (
            <motion.div key={n._id} variants={staggerItem}>
              <NotificationCard notification={n} />
            </motion.div>
          ))}
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Send Notification">
          <form onSubmit={handleSend} className="space-y-4">
            <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea className="input-field" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Message" required />
            <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="general">General</option><option value="reminder">Reminder</option><option value="alert">Alert</option><option value="promotion">Promotion</option>
            </select>
            <select className="input-field" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}>
              <option value="all">All Members</option><option value="active">Active Members</option><option value="expired">Expired Members</option>
            </select>
            <Button type="submit">Send</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
