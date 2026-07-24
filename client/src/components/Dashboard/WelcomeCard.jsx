import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeCard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl gradient-bg p-6 lg:p-8 text-white shadow-xl shadow-primary-500/20"
    >
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl lg:text-3xl font-display font-bold"
        >
          {greeting}, {user?.name?.split(' ')[0]}!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-2 text-white/80"
        >
          Let's crush your fitness goals today.
        </motion.p>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 animate-blob" />
      <div className="absolute bottom-0 right-16 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 animate-blob" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob" style={{ animationDelay: '-2s' }} />
    </motion.div>
  );
}
