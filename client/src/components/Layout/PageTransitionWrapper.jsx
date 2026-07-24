import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const fullVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.3, ease: 'easeIn' } },
};

const subtleVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function PageTransitionWrapper({ children, variant = 'full' }) {
  const location = useLocation();
  const variants = variant === 'subtle' ? subtleVariants : fullVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-transition-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
