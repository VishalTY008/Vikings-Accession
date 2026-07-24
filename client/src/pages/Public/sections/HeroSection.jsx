import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../../../components/UI/MagneticButton';
import { useCursor } from '../../../context/CursorContext';
import ThreeErrorBoundary from '../../../components/3D/ThreeErrorBoundary';
import HeroScene from '../../../components/3D/HeroScene';
import ParticleField from '../../../components/3D/ParticleField';
import GradientBackground from '../../../components/3D/GradientBackground';
import SmokeEffect from '../../../components/3D/SmokeEffect';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const { setCursorVariant } = useCursor();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .fromTo(titleRef.current?.children || [],
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', stagger: 0.15 },
      '-=0.3'
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(ctaRef.current?.children || [],
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1 },
      '-=0.3'
    )
    .fromTo(scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
        opacity: 0.3,
        scale: 0.95,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeErrorBoundary>
        <GradientBackground />
      </ThreeErrorBoundary>

      <ThreeErrorBoundary>
        <ParticleField />
      </ThreeErrorBoundary>

      <ThreeErrorBoundary>
        <div className="absolute inset-0 z-[2]">
          <HeroScene />
        </div>
      </ThreeErrorBoundary>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" ref={textRef}>
        <motion.span
          ref={badgeRef}
          initial={{ opacity: 0 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold gradient-bg text-white mb-6 shadow-glow-primary"
        >
          New: AI-Powered Workout Plans
        </motion.span>

        <div ref={titleRef}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gray-900 dark:text-white leading-[0.95] tracking-tight">
            <span className="block">Your Fitness</span>
            <span className="block gradient-text">Journey Starts</span>
            <span className="block">Here</span>
          </h1>
        </div>

        <p ref={subtitleRef} className="text-lg md:text-xl text-gray-600 dark:text-dark-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          Manage workouts, track progress, chat with trainers, and check in with QR codes — all in one premium gym platform.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <MagneticButton>
            <Link
              to="/signup"
              className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 inline-flex items-center gap-2"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Start Free Trial <FiArrowRight className="text-lg" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-dark-600 text-gray-700 dark:text-dark-300 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-all duration-300 inline-flex items-center gap-2"
              onMouseEnter={() => setCursorVariant('text')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Learn More
            </a>
          </MagneticButton>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-gray-400 dark:text-dark-500"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <FiChevronDown className="text-lg" />
        </motion.div>
      </div>
    </section>
  );
}
