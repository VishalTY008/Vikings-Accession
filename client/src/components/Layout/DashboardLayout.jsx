import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../animations/framerVariants';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-950 overflow-hidden relative">
      {/* Subtle gradient bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/20 dark:from-dark-900/50 dark:via-dark-950 dark:to-dark-900/50" />
      </div>

      {/* Noise overlay */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.015]" aria-hidden="true">
        <filter id="dash-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dash-noise)" />
      </svg>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-[2]">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
