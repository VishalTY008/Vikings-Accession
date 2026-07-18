import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import { getWorkouts, createWorkout } from '../../services/workoutService';
import { getAssignedMembers } from '../../services/trainerService';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';
import Toast from '../../components/UI/Toast';

export default function TrainerWorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ message: '' });
  const [form, setForm] = useState({ member: '', name: '', exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }] });

  useEffect(() => {
    Promise.all([getWorkouts(), getAssignedMembers()])
      .then(([w, m]) => { setPlans(w.data.data.workouts || w.data.data); setMembers(m.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const addExercise = () => setForm({ ...form, exercises: [...form.exercises, { name: '', sets: 3, reps: 10, weight: 0 }] });
  const updateExercise = (i, k, v) => {
    const ex = [...form.exercises]; ex[i] = { ...ex[i], [k]: v }; setForm({ ...form, exercises: ex });
  };
  const removeExercise = (i) => setForm({ ...form, exercises: form.exercises.filter((_, j) => j !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await createWorkout(form); setModal(false); setToast({ message: 'Plan created!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };

  if (loading) return <DashboardLayout><Spinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Workout Plans</h2>
          <Button onClick={() => setModal(true)}>Create Plan</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <motion.div key={p._id} variants={staggerItem} className="glass-card p-5">
              <h4 className="font-bold">{p.name}</h4>
              <p className="text-sm text-gray-500 dark:text-dark-400 capitalize">{p.type} &bull; {p.exercises?.length} exercises</p>
              <p className="text-sm text-gray-500 dark:text-dark-400">{p.estimatedDuration} min</p>
            </motion.div>
          ))}
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Create Workout Plan" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select className="input-field" value={form.member} onChange={e => setForm({ ...form, member: e.target.value })} required>
              <option value="">Select Member</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.user?.name}</option>)}
            </select>
            <Input label="Plan Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            {form.exercises.map((ex, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <Input label="Exercise" value={ex.name} onChange={e => updateExercise(i, 'name', e.target.value)} className="col-span-4 md:col-span-1" />
                <Input label="Sets" type="number" value={ex.sets} onChange={e => updateExercise(i, 'sets', Number(e.target.value))} />
                <Input label="Reps" type="number" value={ex.reps} onChange={e => updateExercise(i, 'reps', Number(e.target.value))} />
                <Input label="Weight" type="number" value={ex.weight} onChange={e => updateExercise(i, 'weight', Number(e.target.value))} />
                <Button type="button" variant="danger" size="sm" onClick={() => removeExercise(i)}>X</Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={addExercise}>+ Add Exercise</Button>
            <Button type="submit">Create</Button>
          </form>
        </Modal>
      </motion.div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </DashboardLayout>
  );
}
