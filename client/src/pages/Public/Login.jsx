import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import AuthBackground from '../../components/3D/AuthBackground';
import MagneticButton from '../../components/UI/MagneticButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-2">Sign in to your gym account</p>
        </div>
        <div className="glass-card p-8 shadow-2xl shadow-primary-500/5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800/30"
            >
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" icon={FiMail} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" icon={FiLock} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-dark-400 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 transition-colors">Forgot password?</Link>
            </div>
            <MagneticButton className="w-full">
              <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
            </MagneticButton>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-dark-400 mt-6">
            Don't have an account? <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
