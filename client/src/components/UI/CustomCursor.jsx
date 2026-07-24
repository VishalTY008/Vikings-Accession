import { useEffect, useRef } from 'react';
import { useCursor } from '../../context/CursorContext';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const { variant, position, isMobile } = useCursor();
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isMobile) return;

    const onMove = () => {
      gsap.to(posRef.current, {
        x: position.x,
        y: position.y,
        duration: 0.15,
        ease: 'power2.out',
        onUpdate: () => {
          if (ringRef.current) {
            ringRef.current.style.left = `${posRef.current.x}px`;
            ringRef.current.style.top = `${posRef.current.y}px`;
          }
        },
      });
      if (dotRef.current) {
        dotRef.current.style.left = `${position.x}px`;
        dotRef.current.style.top = `${position.y}px`;
      }
    };

    onMove();
  }, [position, isMobile]);

  if (isMobile) return null;

  const ringClass = [
    'custom-cursor',
    variant === 'hover' && 'hovering',
    variant === 'text' && 'text-hover',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div ref={ringRef} className={ringClass} />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
}
