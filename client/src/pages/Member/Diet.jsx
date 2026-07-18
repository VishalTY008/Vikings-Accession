import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getDietPlans } from '../../services/workoutService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DietCard from '../../components/Diet/DietCard';
import Spinner from '../../components/UI/Spinner';

export default function MemberDiet() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDietPlans().then(res => setPlans(res.data.data.plans || res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Diet Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(p => (
            <motion.div key={p._id} variants={staggerItem}>
              <DietCard plan={p} />
            </motion.div>
          ))}
        </div>
        {plans.length === 0 && <p className="text-center text-gray-500 dark:text-dark-400 py-10">No diet plans assigned</p>}
      </motion.div>
    </DashboardLayout>
  );
}
