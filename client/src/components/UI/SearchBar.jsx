import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <motion.div
      animate={{ width: focused ? '100%' : '100%' }}
      className={`relative ${className}`}
    >
      <FiSearch size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-primary-500' : 'text-gray-400'}`} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`input-field pl-10 ${focused ? 'ring-2 ring-primary-500/20' : ''}`}
      />
    </motion.div>
  );
}
