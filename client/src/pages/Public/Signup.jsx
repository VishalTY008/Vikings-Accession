import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await signup({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 px-4 py-8">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4"><FiActivity className="text-2xl text-white" /></div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-2">Join your gym community today</p>
        </div>
        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" icon={FiUser} value={form.name} onChange={e=>update('name',e.target.value)} required />
            <Input label="Email" type="email" icon={FiMail} value={form.email} onChange={e=>update('email',e.target.value)} required />
            <Input label="Phone" icon={FiPhone} value={form.phone} onChange={e=>update('phone',e.target.value)} />
            <Input label="Password" type="password" icon={FiLock} value={form.password} onChange={e=>update('password',e.target.value)} required />
            <Input label="Confirm Password" type="password" icon={FiLock} value={form.confirmPassword} onChange={e=>update('confirmPassword',e.target.value)} required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-dark-400 mt-6">
            Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
