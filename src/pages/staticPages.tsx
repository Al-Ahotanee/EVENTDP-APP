import { motion } from 'framer-motion';
import { Layers, Zap, Shield, Heart, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── About ───────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6">
          <Layers size={26} className="text-black" />
        </div>
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-4">About FrameIt</h1>
        <p className="text-ink-400 leading-relaxed mb-8 text-lg">
          FrameIt is a free, open platform for creating personalized event DPs, Twibbons, and banners —
          entirely in your browser. No account needed. No data collected. Just instant, beautiful results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <Zap size={20} />, title: 'Instant', desc: 'Generate your DP in seconds with real-time preview' },
            { icon: <Shield size={20} />, title: 'Private', desc: 'Photos never leave your device. 100% client-side' },
            { icon: <Heart size={20} />, title: 'Free Forever', desc: 'No paywalls, no subscriptions, no tricks' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass border border-white/10 rounded-2xl p-5">
              <div className="text-amber-400 mb-3">{icon}</div>
              <h3 className="font-semibold text-ink-100 mb-1">{title}</h3>
              <p className="text-sm text-ink-400">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold text-ink-100 mb-4">Built for Nigeria</h2>
        <p className="text-ink-400 leading-relaxed mb-6">
          FrameIt was built with Nigeria in mind — for school reunions, government events, sports tournaments,
          religious gatherings, and national celebrations. We understand the need for quality, accessible tools
          that work even on mobile data.
        </p>

        <Link to="/explore" className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm font-bold">
          Browse Campaigns
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
export function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-4">Get In Touch</h1>
        <p className="text-ink-400 mb-10">Have a campaign you want to feature? Or just want to say hello?</p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 glass border border-white/10 rounded-xl">
            <Mail size={18} className="text-amber-400" />
            <div>
              <p className="text-xs text-ink-500">Email</p>
              <p className="text-sm text-ink-200">hello@frameit.app</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 glass border border-white/10 rounded-xl">
            <MapPin size={18} className="text-amber-400" />
            <div>
              <p className="text-xs text-ink-500">Location</p>
              <p className="text-sm text-ink-200">Nigeria 🇳🇬</p>
            </div>
          </div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-ink-100">Send a Message</h2>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-amber-400/60 text-sm"
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-amber-400/60 text-sm"
          />
          <textarea
            rows={4}
            placeholder="Your message..."
            className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-amber-400/60 text-sm resize-none"
          />
          <button className="w-full btn-gold py-3 rounded-xl text-sm font-bold">
            Send Message
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Privacy ─────────────────────────────────────────────────────────────────
export function PrivacyPage() {
  const sections = [
    { title: 'No Data Collection', body: 'FrameIt does not collect, store, or transmit any personal data. All processing happens locally in your browser.' },
    { title: 'Photos Stay On Your Device', body: 'When you upload a photo, it never leaves your device. We process images entirely in the browser using the HTML5 Canvas API.' },
    { title: 'Local Storage', body: 'We use browser localStorage only to remember your theme preference, recently viewed campaigns, and favorite campaigns. This data never leaves your device.' },
    { title: 'No Cookies', body: 'FrameIt does not use cookies for tracking or advertising purposes.' },
    { title: 'Third-Party Services', body: 'We use Google Fonts for typography. Font requests go through Google\'s CDN. No other third-party tracking services are used.' },
    { title: 'Changes', body: 'We may update this policy from time to time. Continued use of FrameIt constitutes acceptance of any changes.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-2">Privacy Policy</h1>
        <p className="text-ink-500 text-sm mb-10">Last updated: May 2026</p>
        <div className="space-y-6">
          {sections.map(({ title, body }) => (
            <div key={title} className="glass border border-white/10 rounded-xl p-5">
              <h2 className="font-display text-lg font-semibold text-ink-100 mb-2">{title}</h2>
              <p className="text-sm text-ink-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-2">Terms of Use</h1>
        <p className="text-ink-500 text-sm mb-10">Last updated: May 2026</p>
        <div className="prose prose-invert max-w-none space-y-5 text-sm text-ink-400 leading-relaxed">
          <p>By using FrameIt, you agree to these terms. Please read them carefully.</p>
          {[
            ['Acceptable Use', 'You may use FrameIt to generate personal event DPs for lawful purposes. You may not use the platform to create content that is harmful, hateful, or violates the rights of others.'],
            ['Intellectual Property', 'Campaign frames and templates are owned by their respective creators. Your personal photos remain your property.'],
            ['Disclaimer', 'FrameIt is provided "as is" without warranties. We are not liable for any damages arising from use of the platform.'],
            ['Modifications', 'We reserve the right to modify or discontinue the service at any time without notice.'],
            ['Governing Law', 'These terms are governed by the laws of the Federal Republic of Nigeria.'],
          ].map(([title, body]) => (
            <div key={title as string} className="glass border border-white/10 rounded-xl p-5">
              <h2 className="font-display text-lg font-semibold text-ink-100 mb-2">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-8xl mb-6">🖼️</div>
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-3">Page Not Found</h1>
        <p className="text-ink-400 mb-8">This page doesn't exist. Let's get you back on track.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/" className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">Go Home</Link>
          <Link to="/explore" className="px-6 py-3 rounded-xl glass border border-white/10 text-ink-200 text-sm font-medium hover:border-amber-400/30 transition-all">Browse Events</Link>
        </div>
      </motion.div>
    </div>
  );
}
