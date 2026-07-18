import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getAssignedMembers } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Avatar from '../../components/UI/Avatar';
import Badge from '../../components/UI/Badge';
import SearchBar from '../../components/UI/SearchBar';
import Spinner from '../../components/UI/Spinner';

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedMembers().then(r => { setMembers(r.data.data); setFiltered(r.data.data); }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (s) => {
    const q = s.toLowerCase();
    setFiltered(members.filter(m => m.user?.name?.toLowerCase().includes(q) || m.user?.email?.toLowerCase().includes(q)));
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">My Members</h2>
        <SearchBar onSearch={handleSearch} placeholder="Search members..." className="max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <motion.div key={m._id} variants={staggerItem} whileHover={{ y: -4 }} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={m.user?.name} src={m.user?.profileImage} />
                <div>
                  <p className="font-semibold">{m.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-400">{m.user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Membership</span><Badge variant="info" className="capitalize">{m.membershipType}</Badge></div>
                <div className="flex justify-between"><span className="text-gray-500">Weight</span><span>{m.weight || '-'} kg</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
