import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Search, Menu, X, Layers, Home, Compass, Info, Mail, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';

export default function Layout() {
  const { darkMode, toggleDarkMode } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/explore', label: 'Explore', icon: <Compass size={16} /> },
    { to: '/about', label: 'About', icon: <Info size={16} /> },
    { to: '/contact', label: 'Contact', icon: <Mail size={16} /> },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Navbar */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/10 shadow-2xl' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-400/30 transition-shadow">
              <Layers size={16} className="text-black" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Frame<span className="gradient-text">It</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                  isActive
                    ? 'bg-amber-400/10 text-amber-400'
                    : 'text-ink-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-300 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/explore"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg btn-gold text-sm"
            >
              <Search size={14} />
              Browse Events
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-white/10"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                    isActive ? 'bg-amber-400/10 text-amber-400' : 'text-ink-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Layers size={14} className="text-black" />
                </div>
                <span className="font-display text-lg font-bold">Frame<span className="gradient-text">It</span></span>
              </div>
              <p className="text-sm text-ink-400 leading-relaxed">
                Create personalized event DPs and Twibbons instantly. No signup needed.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3 uppercase tracking-wider">Platform</h4>
              <div className="flex flex-col gap-2">
                {[['/', 'Home'], ['/explore', 'Explore'], ['/about', 'About']].map(([to, label]) => (
                  <Link key={to} to={to} className="text-sm text-ink-400 hover:text-amber-400 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3 uppercase tracking-wider">Legal</h4>
              <div className="flex flex-col gap-2">
                {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use']].map(([to, label]) => (
                  <Link key={to} to={to} className="text-sm text-ink-400 hover:text-amber-400 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3 uppercase tracking-wider">Contact</h4>
              <Link to="/contact" className="text-sm text-ink-400 hover:text-amber-400 transition-colors">Get in touch</Link>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-500">© 2026 FrameIt. All rights reserved.</p>
            <p className="text-xs text-ink-500 flex items-center gap-1">
              Made with <Heart size={11} className="text-red-400 fill-red-400" /> in Nigeria
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
