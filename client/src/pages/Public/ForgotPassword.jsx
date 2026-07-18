import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiActivity, FiArrowLeft } from 'react-icons/fi';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await api.post('/auth/forgot-password', { email }); setSent(true); }
    catch (err) { setError(err.response?.data?.message || 'Failed to send'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 px-4">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4"><FiActivity className="text-2xl text-white" /></div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-2">Enter your email to receive a reset link</p>
        </div>
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto"><FiMail className="text-2xl text-green-500" /></div>
              <p className="text-gray-600 dark:text-dark-300">Check your email for the password reset link.</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600"><FiArrowLeft /> Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
              <Input label="Email" type="email" icon={FiMail} value={email} onChange={e=>setEmail(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400 hover:text-primary-500"><FiArrowLeft /> Back to Login</Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
