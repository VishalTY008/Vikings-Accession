import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? {
        y: -4,
        boxShadow: glow
          ? '0 25px 50px -12px rgba(99, 102, 241, 0.15)'
          : '0 20px 40px rgba(79, 70, 229, 0.08)',
      } : {}}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card p-6 transition-all duration-300 ${glow ? 'hover:shadow-glow-primary' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
