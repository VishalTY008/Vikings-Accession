import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4">
            <FiActivity className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-2">Sign in to your gym account</p>
        </div>
        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" icon={FiMail} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" icon={FiLock} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-dark-400">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600">Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-dark-400 mt-6">
            Don't have an account? <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
