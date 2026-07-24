import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiZap } from 'react-icons/fi';

const testimonials = [
  { name: 'Sarah Johnson', role: 'Member since 2023', text: 'FitZone transformed my life. Lost 30lbs in 6 months.', rating: 5 },
  { name: 'Mike Chen', role: 'Member since 2022', text: 'The best gym platform ever.', rating: 5 },
  { name: 'Emma Davis', role: 'Member since 2024', text: 'Love the QR check-in and real-time chat.', rating: 5 },
];

export default function TestimonialsSection() {
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
          { opacity: 0, y: 40 + i * 10 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            What Members <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiZap
                      key={j}
                      className="text-warning-400 fill-warning-400 group-hover:scale-110 transition-transform"
                      size={16}
                      style={{ transitionDelay: `${j * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-dark-300 mb-6 flex-1 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
