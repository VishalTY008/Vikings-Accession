import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiActivity, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import api from '../../services/api';
import AuthBackground from '../../components/3D/AuthBackground';
import MagneticButton from '../../components/UI/MagneticButton';

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
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <AuthBackground />
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4 shadow-glow-primary"
          >
            <FiActivity className="text-2xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-2">Enter your email to receive a reset link</p>
        </div>
        <div className="glass-card p-8 shadow-2xl shadow-primary-500/5">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center mx-auto"
              >
                <FiCheck className="text-2xl text-accent-500" />
              </motion.div>
              <p className="text-gray-600 dark:text-dark-300">Check your email for the password reset link.</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors">
                <FiArrowLeft /> Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.div>
              )}
              <Input label="Email" type="email" icon={FiMail} value={email} onChange={e=>setEmail(e.target.value)} required />
              <MagneticButton className="w-full">
                <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
              </MagneticButton>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400 hover:text-primary-500 transition-colors">
                <FiArrowLeft /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
