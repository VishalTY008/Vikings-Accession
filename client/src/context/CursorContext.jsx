import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [variant, setVariant] = useState('default');
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, handleMouseMove]);

  const setCursorVariant = useCallback((v) => setVariant(v), []);

  return (
    <CursorContext.Provider value={{ variant, setCursorVariant, position, isMobile }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) return { variant: 'default', setCursorVariant: () => {}, position: { x: -100, y: -100 }, isMobile: true };
  return ctx;
}
