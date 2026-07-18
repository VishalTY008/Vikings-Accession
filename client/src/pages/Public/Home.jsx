import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiUsers, FiTrendingUp, FiArrowRight, FiCheck, FiZap, FiHeart, FiTarget, FiChevronDown, FiChevronUp, FiMenu, FiX, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { staggerContainer, staggerItem } from '../../animations/framerVariants';
import AnimatedCounter from '../../components/UI/AnimatedCounter';

const stats = [
  { label: 'Active Members', value: 2500, suffix: '+' },
  { label: 'Expert Trainers', value: 35, suffix: '+' },
  { label: 'Workout Plans', value: 150, suffix: '+' },
  { label: 'Happy Clients', value: 98, suffix: '%' },
];

const features = [
  { icon: FiActivity, title: 'Workout Plans', desc: 'Custom workout plans tailored to your goals.' },
  { icon: FiHeart, title: 'Diet Plans', desc: 'Personalized nutrition plans.' },
  { icon: FiTrendingUp, title: 'Progress Tracking', desc: 'Track weight, BMI, body fat, muscle gain.' },
  { icon: FiUsers, title: 'Expert Trainers', desc: 'Certified trainers in various disciplines.' },
  { icon: FiTarget, title: 'QR Check-in', desc: 'Quick gym check-in with your QR code.' },
  { icon: FiZap, title: 'Real-time Chat', desc: 'Direct messaging with your trainer.' },
];

const pricingPlans = [
  { name: 'Basic', price: 29, period: '/month', features: ['Gym Floor Access', 'Locker Room', 'Basic Equipment', 'Mobile App'], popular: false },
  { name: 'Standard', price: 49, period: '/month', features: ['Everything in Basic', '1 Trainer Session/Week', 'Diet Consultation', 'Progress Tracking'], popular: true },
  { name: 'Premium', price: 79, period: '/month', features: ['Everything in Standard', 'Unlimited Sessions', 'Custom Diet Plan', 'Sauna Access'], popular: false },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Member since 2023', text: 'FitZone transformed my life. Lost 30lbs in 6 months.', rating: 5 },
  { name: 'Mike Chen', role: 'Member since 2022', text: 'The best gym platform ever.', rating: 5 },
  { name: 'Emma Davis', role: 'Member since 2024', text: 'Love the QR check-in and real-time chat.', rating: 5 },
];

const faqs = [
  { q: 'How do I sign up?', a: 'Click Sign Up, choose your plan, create your account!' },
  { q: 'Can I change my trainer?', a: 'Yes! Request a change through your dashboard.' },
  { q: 'Is there a free trial?', a: 'We offer a 7-day free trial.' },
  { q: 'How does QR check-in work?', a: 'Show your QR code at the entrance.' },
];

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-0 border-b border-gray-100 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"><FiActivity className="text-white" /></div>
            <span className="text-xl font-display font-bold">FitZone</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-gray-600 dark:text-dark-400 hover:text-primary-500">Features</a>
            <a href="#pricing" className="text-gray-600 dark:text-dark-400 hover:text-primary-500">Pricing</a>
            <a href="#testimonials" className="text-gray-600 dark:text-dark-400 hover:text-primary-500">Testimonials</a>
            <a href="#faq" className="text-gray-600 dark:text-dark-400 hover:text-primary-500">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-dark-400 hover:text-primary-500">Sign In</Link>
            <Link to="/signup" className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-medium hover:shadow-lg transition-all">Get Started</Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <FiX /> : <FiMenu />}</button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 dark:border-dark-700 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm">Features</a>
            <a href="#pricing" className="block text-sm">Pricing</a>
            <Link to="/login" className="block text-sm">Sign In</Link>
            <Link to="/signup" className="block px-4 py-2 rounded-xl gradient-bg text-white text-sm text-center">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold gradient-bg text-white mb-6">New: AI-Powered Workout Plans</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight">
            Your Fitness Journey<br /><span className="gradient-text">Starts Here</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-dark-400 mt-6 max-w-2xl mx-auto">
            Manage workouts, track progress, chat with trainers, and check in with QR codes — all in one premium gym platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/signup" className="px-8 py-3 rounded-xl gradient-bg text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all text-center">
              Start Free Trial <FiArrowRight className="inline ml-1" />
            </Link>
            <a href="#features" className="px-8 py-3 rounded-xl border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-dark-300 font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-all text-center">
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={staggerItem} className="text-center">
              <AnimatedCounter value={s.value} suffix={s.suffix} className="text-3xl md:text-4xl font-display font-bold gradient-text" />
              <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Everything You Need</h2>
            <p className="text-gray-500 dark:text-dark-400 mt-3">Powerful features for members, trainers, and admins</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -4 }} className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4"><f.icon className="text-white" /></div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Simple Pricing</h2>
            <p className="text-gray-500 dark:text-dark-400 mt-3">Choose the plan that fits you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={'glass-card p-8 relative ' + (p.popular ? 'ring-2 ring-primary-500 shadow-xl' : '')}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold gradient-bg text-white">Most Popular</span>}
                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                <div className="mt-4 mb-6"><span className="text-4xl font-display font-bold">${p.price}</span><span className="text-gray-500 dark:text-dark-400 text-sm">{p.period}</span></div>
                <ul className="space-y-3 mb-8">{p.features.map((f, j) => <li key={j} className="flex items-center gap-2 text-sm"><FiCheck className="text-accent-500 shrink-0" />{f}</li>)}</ul>
                <Link to="/signup" className={'block text-center py-3 rounded-xl font-medium transition-all ' + (p.popular ? 'gradient-bg text-white hover:shadow-lg' : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800')}>Get Started</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">What Members Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <FiZap key={j} className="text-warning-400 fill-warning-400" size={14} />)}</div>
                <p className="text-sm text-gray-600 dark:text-dark-300 mb-4">"{t.text}"</p>
                <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-gray-500 dark:text-dark-400">{t.role}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">FAQ</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-medium">{f.q}</span>
                  {openFaq === i ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-sm text-gray-500 dark:text-dark-400">{f.a}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100 dark:border-dark-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center"><FiActivity className="text-white text-sm" /></div><span className="font-display font-bold">FitZone</span></div>
            <p className="text-sm text-gray-500 dark:text-dark-400">Premium gym management platform.</p>
          </div>
          <div><h4 className="font-semibold mb-3">Platform</h4><ul className="space-y-2 text-sm text-gray-500 dark:text-dark-400"><li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#faq">FAQ</a></li></ul></div>
          <div><h4 className="font-semibold mb-3">Contact</h4><ul className="space-y-2 text-sm text-gray-500 dark:text-dark-400"><li className="flex items-center gap-2"><FiMail size={14} /> info@fitzone.com</li><li className="flex items-center gap-2"><FiPhone size={14} /> +1 234 567 890</li><li className="flex items-center gap-2"><FiMapPin size={14} /> 123 Fitness St</li></ul></div>
          <div><h4 className="font-semibold mb-3">Account</h4><ul className="space-y-2 text-sm"><li><Link to="/login" className="text-primary-500 hover:text-primary-600">Sign In</Link></li><li><Link to="/signup" className="text-primary-500 hover:text-primary-600">Sign Up</Link></li></ul></div>
        </div>
        <div className="text-center text-sm text-gray-400 dark:text-dark-500 mt-8">&copy; 2024 FitZone. All rights reserved.</div>
      </footer>
    </div>
  );
}
