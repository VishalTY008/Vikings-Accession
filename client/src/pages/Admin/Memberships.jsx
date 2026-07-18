import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Badge from '../../components/UI/Badge';
import Spinner from '../../components/UI/Spinner';
import api from '../../services/api';

export default function AdminMemberships() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/members').then(r => setMembers(r.data.data.members || r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Memberships</h2>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-dark-700">
              <th className="text-left p-4 font-medium text-gray-500">Member</th>
              <th className="text-left p-4 font-medium text-gray-500">Type</th>
              <th className="text-left p-4 font-medium text-gray-500">Start Date</th>
              <th className="text-left p-4 font-medium text-gray-500">End Date</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
            </tr></thead>
            <tbody>{members.map(m => (
              <motion.tr key={m._id} variants={staggerItem} className="border-b border-gray-50 dark:border-dark-700">
                <td className="p-4 font-medium">{m.user?.name}</td>
                <td className="p-4 capitalize">{m.membershipType}</td>
                <td className="p-4">{new Date(m.membershipStart).toLocaleDateString()}</td>
                <td className="p-4">{new Date(m.membershipEnd).toLocaleDateString()}</td>
                <td className="p-4">
                  <Badge variant={new Date(m.membershipEnd) > new Date() ? 'success' : 'danger'}>
                    {new Date(m.membershipEnd) > new Date() ? 'Active' : 'Expired'}
                  </Badge>
                </td>
              </motion.tr>
            ))}</tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
