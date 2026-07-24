import { useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';

export default function useScrollAnimation(ref, animation, options = {}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!ref?.current) return;

    const defaults = {
      trigger: ref.current,
      start: 'top 85%',
      end: 'bottom 15%',
      toggleActions: 'play none none reverse',
      ...options,
    };

    const ctx = gsap.context(() => {
      if (typeof animation === 'function') {
        animation(ref.current, defaults);
      } else {
        gsap.fromTo(ref.current, animation.from || { opacity: 0, y: 40 }, {
          ...animation.to,
          scrollTrigger: defaults,
        });
      }
    });

    triggerRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, [ref, options]);

  return triggerRef;
}

export function useParallax(ref, speed = 0.5) {
  useEffect(() => {
    if (!ref?.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed]);
}
