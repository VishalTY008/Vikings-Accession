import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getMyAttendance, checkIn, checkOut } from '../../services/memberService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import QRCard from '../../components/QR/QRCard';
import Card from '../../components/UI/Card';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function MemberAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '' });

  const fetchAttendance = () => {
    getMyAttendance().then(res => {
      setAttendance(res.data.data.attendance || []);
      setToday(res.data.data.today || null);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleCheckIn = async () => {
    try { await checkIn(); fetchAttendance(); setToast({ message: 'Checked in!', type: 'success' }); }
    catch { setToast({ message: 'Check-in failed', type: 'error' }); }
  };

  const handleCheckOut = async () => {
    try { await checkOut(); fetchAttendance(); setToast({ message: 'Checked out!', type: 'success' }); }
    catch { setToast({ message: 'Check-out failed', type: 'error' }); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Attendance</h2>
        <motion.div variants={staggerItem}>
          <QRCard
            checkedIn={!!today?.checkIn}
            checkOutTime={today?.checkOut}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <Card className="p-6">
            <h3 className="font-display font-semibold mb-4">History</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendance.map(a => (
                <div key={a._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                  <span className="text-sm">{new Date(a.date).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">{a.checkIn?.slice(0, 5)} - {a.checkOut?.slice(0, 5) || 'Now'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'present' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
