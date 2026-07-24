import { useRef } from 'react';
import { gsap } from 'gsap';
import { useCursor } from '../../context/CursorContext';
import useDeviceCapabilities from '../../hooks/useDeviceCapabilities';

export default function MagneticButton({ children, className = '', strength = 8, ...props }) {
  const ref = useRef(null);
  const { setCursorVariant } = useCursor();
  const { isMobile } = useDeviceCapabilities();

  const handleMouseMove = (e) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (isMobile || !ref.current) return;
    setCursorVariant('default');
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setCursorVariant('hover');
  };

  return (
    <div
      ref={ref}
      className={`magnetic-btn-wrapper inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </div>
  );
}
