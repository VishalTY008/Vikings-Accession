import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  { q: 'How do I sign up?', a: 'Click Sign Up, choose your plan, create your account!' },
  { q: 'Can I change my trainer?', a: 'Yes! Request a change through your dashboard.' },
  { q: 'Is there a free trial?', a: 'We offer a 7-day free trial.' },
  { q: 'How does QR check-in work?', a: 'Show your QR code at the entrance.' },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const itemsRef = useRef([]);
  const answerRefs = useRef([]);

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

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 90%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    answerRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openFaq === i) {
        gsap.fromTo(el,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  }, [openFaq]);

  const toggle = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-24 px-4 bg-gray-50/50 dark:bg-dark-800/30 relative">
      <div className="max-w-3xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              ref={(el) => (itemsRef.current[i] = el)}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {f.q}
                </span>
                <span className="text-gray-400 ml-4 shrink-0 transition-transform duration-300"
                  style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                  <FiChevronDown size={20} />
                </span>
              </button>
              <div
                ref={(el) => (answerRefs.current[i] = el)}
                style={{
                  height: openFaq === i ? 'auto' : 0,
                  opacity: openFaq === i ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                <div className="px-6 pb-5 text-gray-500 dark:text-dark-400 leading-relaxed">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
