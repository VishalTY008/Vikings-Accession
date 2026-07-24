import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiActivity, FiHeart, FiTrendingUp, FiUsers, FiTarget, FiZap } from 'react-icons/fi';
import FloatingCard from '../../../components/UI/FloatingCard';

const features = [
  { icon: FiActivity, title: 'Workout Plans', desc: 'Custom workout plans tailored to your goals.' },
  { icon: FiHeart, title: 'Diet Plans', desc: 'Personalized nutrition plans.' },
  { icon: FiTrendingUp, title: 'Progress Tracking', desc: 'Track weight, BMI, body fat, muscle gain.' },
  { icon: FiUsers, title: 'Expert Trainers', desc: 'Certified trainers in various disciplines.' },
  { icon: FiTarget, title: 'QR Check-in', desc: 'Quick gym check-in with your QR code.' },
  { icon: FiZap, title: 'Real-time Chat', desc: 'Direct messaging with your trainer.' },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
          }
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 px-4 relative">
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-secondary-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-gray-500 dark:text-dark-400 mt-4 text-lg max-w-xl mx-auto">
            Powerful features for members, trainers, and admins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <FloatingCard className="p-8 h-full group cursor-default" delay={i * 0.05} glow>
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <f.icon className="text-white text-xl" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-dark-400 leading-relaxed">{f.desc}</p>
              </FloatingCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
