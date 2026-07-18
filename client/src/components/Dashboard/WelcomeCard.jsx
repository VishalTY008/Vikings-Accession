import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeCard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl gradient-bg p-6 lg:p-8 text-white"
    >
      <div className="relative z-10">
        <h2 className="text-2xl lg:text-3xl font-display font-bold">{greeting}, {user?.name?.split(' ')[0]}!</h2>
        <p className="mt-2 text-white/80">Let's crush your fitness goals today.</p>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 animate-blob" />
      <div className="absolute bottom-0 right-16 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 animate-blob animation-delay-2000" />
    </motion.div>
  );
}
