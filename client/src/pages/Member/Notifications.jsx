import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { useNotifications } from '../../context/NotificationContext';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import NotificationCard from '../../components/Notifications/NotificationCard';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';

export default function MemberNotifications() {
  const { notifications, markAsRead, markAllRead } = useNotifications();
  const [loading] = useState(false);

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
        </div>
        {loading ? <Spinner className="py-20" /> : (
          <div className="space-y-3">
            {notifications.map(n => (
              <motion.div key={n._id} variants={staggerItem}>
                <NotificationCard notification={n} onRead={() => markAsRead(n._id)} />
              </motion.div>
            ))}
            {notifications.length === 0 && <p className="text-center text-gray-500 dark:text-dark-400 py-10">No notifications</p>}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
