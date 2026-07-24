import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

export default function FloatingCard({ children, className = '', delay = 0, glow = false, ...props }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!prefersReduced ? {
        y: -8,
        boxShadow: glow
          ? '0 25px 50px -12px rgba(99, 102, 241, 0.2)'
          : '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.3 },
      } : {}}
      animate={!prefersReduced ? {
        y: [-4, 4, -4],
      } : {}}
      {...(!prefersReduced && {
        transition: {
          y: { duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut' },
        },
      })}
      className={`glass-card ${glow ? 'animate-glow-pulse' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
