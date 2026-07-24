import { Link } from 'react-router-dom';
import { FiActivity, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function FooterSection() {
  return (
    <footer className="py-16 px-4 border-t border-gray-100 dark:border-dark-700 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <FiActivity className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900 dark:text-white">FitZone</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-400 leading-relaxed">
            Premium gym management platform.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
          <ul className="space-y-3 text-sm text-gray-500 dark:text-dark-400">
            <li><a href="#features" className="hover:text-primary-500 transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a></li>
            <li><a href="#faq" className="hover:text-primary-500 transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-500 dark:text-dark-400">
            <li className="flex items-center gap-2"><FiMail size={14} className="text-primary-500" /> info@fitzone.com</li>
            <li className="flex items-center gap-2"><FiPhone size={14} className="text-primary-500" /> +1 234 567 890</li>
            <li className="flex items-center gap-2"><FiMapPin size={14} className="text-primary-500" /> 123 Fitness St</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Account</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/login" className="text-primary-500 hover:text-primary-600 hover:underline transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-primary-500 hover:text-primary-600 hover:underline transition-colors">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 dark:text-dark-500 mt-12">
        &copy; {new Date().getFullYear()} FitZone. All rights reserved.
      </div>
    </footer>
  );
}
