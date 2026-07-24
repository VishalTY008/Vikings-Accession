import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedCounter from '../../../components/UI/AnimatedCounter';

const stats = [
  { label: 'Active Members', value: 2500, suffix: '+' },
  { label: 'Expert Trainers', value: 35, suffix: '+' },
  { label: 'Workout Plans', value: 150, suffix: '+' },
  { label: 'Happy Clients', value: 98, suffix: '%' },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="text-center"
          >
            <AnimatedCounter
              value={s.value}
              suffix={s.suffix}
              className="text-4xl md:text-5xl font-display font-bold gradient-text"
            />
            <p className="text-sm text-gray-500 dark:text-dark-400 mt-2 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary-500/30 to-transparent" />
    </section>
  );
}
