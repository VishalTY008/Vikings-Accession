import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheck } from 'react-icons/fi';
import MagneticButton from '../../../components/UI/MagneticButton';

const pricingPlans = [
  { name: 'Basic', price: 29, period: '/month', features: ['Gym Floor Access', 'Locker Room', 'Basic Equipment', 'Mobile App'], popular: false },
  { name: 'Standard', price: 49, period: '/month', features: ['Everything in Basic', '1 Trainer Session/Week', 'Diet Consultation', 'Progress Tracking'], popular: true },
  { name: 'Premium', price: 79, period: '/month', features: ['Everything in Standard', 'Unlimited Sessions', 'Custom Diet Plan', 'Sauna Access'], popular: false },
];

export default function PricingSection() {
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
          { opacity: 0, y: 50, rotateX: 8 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.7,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-24 px-4 bg-gray-50/50 dark:bg-dark-800/30 relative">
      <div className="max-w-5xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-gray-500 dark:text-dark-400 mt-4 text-lg">Choose the plan that fits you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((p, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ perspective: '1000px' }}
            >
              <div className={
                'glass-card p-8 relative h-full flex flex-col transition-all duration-300 hover:shadow-xl ' +
                (p.popular
                  ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10 animate-glow-pulse'
                  : 'hover:shadow-primary-500/5')
              }>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold gradient-bg text-white shadow-glow-primary">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">{p.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-5xl font-display font-bold text-gray-900 dark:text-white">${p.price}</span>
                  <span className="text-gray-500 dark:text-dark-400 text-sm ml-1">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600 dark:text-dark-300">
                      <FiCheck className="text-accent-500 shrink-0 text-lg" />{f}
                    </li>
                  ))}
                </ul>
                <MagneticButton className="w-full">
                  <Link
                    to="/signup"
                    className={
                      'block text-center py-3.5 rounded-xl font-semibold transition-all duration-300 w-full ' +
                      (p.popular
                        ? 'gradient-bg text-white hover:shadow-lg hover:shadow-primary-500/25'
                        : 'border-2 border-gray-200 dark:border-dark-600 text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-800')
                    }
                  >
                    Get Started
                  </Link>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
