import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { useTheme } from '../../context/ThemeContext';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';
import api from '../../services/api';

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({ gymName: '', gymAddress: '', gymPhone: '', gymEmail: '', openingHours: '06:00', closingHours: '22:00' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '' });

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.data || settings)).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/settings', settings); setToast({ message: 'Settings saved!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
    finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-display font-bold">Settings</h2>
        <motion.div variants={staggerItem} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold text-lg">Gym Information</h3>
          <Input label="Gym Name" value={settings.gymName} onChange={e => setSettings({ ...settings, gymName: e.target.value })} />
          <Input label="Address" value={settings.gymAddress} onChange={e => setSettings({ ...settings, gymAddress: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={settings.gymPhone} onChange={e => setSettings({ ...settings, gymPhone: e.target.value })} />
            <Input label="Email" type="email" value={settings.gymEmail} onChange={e => setSettings({ ...settings, gymEmail: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Opening Hours" type="time" value={settings.openingHours} onChange={e => setSettings({ ...settings, openingHours: e.target.value })} />
            <Input label="Closing Hours" type="time" value={settings.closingHours} onChange={e => setSettings({ ...settings, closingHours: e.target.value })} />
          </div>
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </motion.div>
        <motion.div variants={staggerItem} className="glass-card p-6">
          <h3 className="font-semibold text-lg mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button onClick={toggleTheme} className={'w-12 h-6 rounded-full transition-colors ' + (theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300')}>
              <span className={'block w-5 h-5 rounded-full bg-white shadow transform transition-transform ' + (theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5')} />
            </button>
          </div>
        </motion.div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
