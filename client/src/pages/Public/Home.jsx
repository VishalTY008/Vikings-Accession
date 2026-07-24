import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiMenu, FiX } from 'react-icons/fi';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { useCursor } from '../../context/CursorContext';

const HeroSection = lazy(() => import('./sections/HeroSection'));
const StatsSection = lazy(() => import('./sections/StatsSection'));
const FeaturesSection = lazy(() => import('./sections/FeaturesSection'));
const PricingSection = lazy(() => import('./sections/PricingSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const FAQSection = lazy(() => import('./sections/FAQSection'));
const FooterSection = lazy(() => import('./sections/FooterSection'));

function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useSmoothScroll();
  const { setCursorVariant } = useCursor();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (href) => {
    if (scrollTo) {
      scrollTo(href);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-card rounded-none border-0 border-b border-gray-100/50 dark:border-dark-700/50 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center hover:scale-110 hover:rotate-3 transition-transform duration-300">
              <FiActivity className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900 dark:text-white">FitZone</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-gray-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors relative group"
                onMouseEnter={() => setCursorVariant('text')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-dark-400 hover:text-primary-500 transition-colors"
              onMouseEnter={() => setCursorVariant('text')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenu ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden border-t border-gray-100 dark:border-dark-700"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="block text-sm font-medium text-gray-600 dark:text-dark-400 py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <Link to="/login" className="block text-sm font-medium text-gray-600 dark:text-dark-400 py-2" onClick={() => setMobileMenu(false)}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold text-center"
                onClick={() => setMobileMenu(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Sections */}
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FooterSection />
      </Suspense>
    </div>
  );
}
