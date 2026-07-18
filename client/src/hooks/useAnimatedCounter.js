import { useState, useEffect, useRef } from 'react';

const useAnimatedCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          startTime.current = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              countRef.current = requestAnimationFrame(animate);
            }
          };
          countRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const el = document.getElementById(`counter-${end}`);
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (countRef.current) cancelAnimationFrame(countRef.current);
    };
  }, [end, duration]);

  return count;
};

export default useAnimatedCounter;
