import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/memberService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Avatar from '../../components/UI/Avatar';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function MemberProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getProfile().then(res => {
      setProfile(res.data.data);
      setForm(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setProfile(res.data.data);
      updateUser(res.data.data);
      setEditing(false);
      setToast({ message: 'Profile updated!', type: 'success' });
    } catch {
      setToast({ message: 'Update failed', type: 'error' });
    } finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={staggerItem} className="glass-card p-8">
          <div className="flex flex-col items-center mb-6">
            <Avatar name={user?.name} src={user?.profileImage} size="xl" />
            <h2 className="text-2xl font-display font-bold mt-4">{user?.name}</h2>
            <p className="text-gray-500 dark:text-dark-400">{user?.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} disabled={!editing} />
            <Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!editing} />
            <Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!editing} />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth?.slice(0, 10) || ''} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} disabled={!editing} />
            <Input label="Weight (kg)" type="number" value={form.weight || ''} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} disabled={!editing} />
            <Input label="Height (cm)" type="number" value={form.height || ''} onChange={e => setForm({ ...form, height: Number(e.target.value) })} disabled={!editing} />
          </div>
          <div className="flex gap-3 mt-6">
            {editing ? (
              <>
                <Button onClick={handleSave} loading={saving}>Save Changes</Button>
                <Button variant="ghost" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </motion.div>
        {profile?.membershipType && (
          <motion.div variants={staggerItem} className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Membership</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-sm text-gray-500 dark:text-dark-400">Type</p><p className="font-bold capitalize">{profile.membershipType}</p></div>
              <div><p className="text-sm text-gray-500 dark:text-dark-400">Start</p><p className="font-bold">{new Date(profile.membershipStart).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-gray-500 dark:text-dark-400">Expires</p><p className="font-bold">{new Date(profile.membershipEnd).toLocaleDateString()}</p></div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
