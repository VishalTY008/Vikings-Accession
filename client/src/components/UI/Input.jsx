import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Input({ label, icon: Icon, error, className = '', ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-primary-500' : 'text-gray-400'}`}>
            <Icon size={18} />
          </div>
        )}
        <input
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-danger-500 focus:ring-danger-500' : ''} ${focused ? 'ring-2 ring-primary-500/20 shadow-glow-primary/10' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {focused && (
          <motion.div
            layoutId="input-glow"
            className="absolute inset-0 rounded-xl ring-2 ring-primary-500/20 pointer-events-none"
            initial={false}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
