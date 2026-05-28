import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, TrendingUp, Star, Clock, Zap } from 'lucide-react';
import { campaigns, getFeaturedCampaigns, getTrendingCampaigns, searchCampaigns } from '@/config/campaigns';
import { useAppStore } from '@/store/appStore';
import CampaignCard from '@/components/campaign/CampaignCard';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(campaigns);
  const [searching, setSearching] = useState(false);
  const { recentCampaigns } = useAppStore();
  const navigate = useNavigate();
  const featured = getFeaturedCampaigns();
  const trending = getTrendingCampaigns();

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      setSearchResults(searchCampaigns(query));
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden noise-overlay">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-600/5 blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/3 blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-8">
              <Sparkles size={12} />
              Create · Share · Celebrate
            </span>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
              Your Event.
              <br />
              <span className="gradient-text">Your Face.</span>
              <br />
              Instantly.
            </h1>

            <p className="text-lg text-ink-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Generate personalized event DPs, Twibbons and banners in seconds.
              Upload your photo, add your name, download HD. No signup.
            </p>
          </motion.div>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, campaigns..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl glass border border-white/15 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/20 text-ink-100 placeholder-ink-500 text-sm transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold px-5 py-2 rounded-xl text-sm"
              >
                Search
              </button>
            </div>

            {/* Search dropdown */}
            {query.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-0 right-0 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                {searching ? (
                  <div className="px-4 py-3 text-sm text-ink-400">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-ink-400">No campaigns found</div>
                ) : (
                  searchResults.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      to={`/${c.slug}`}
                      onClick={() => setQuery('')}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: c.themeColors.primary }} />
                      <div className="text-left min-w-0">
                        <p className="text-sm font-medium text-ink-100 truncate">{c.shortTitle}</p>
                        <p className="text-xs text-ink-500 truncate">{c.eventDate}</p>
                      </div>
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </motion.form>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            <span className="text-xs text-ink-500">Popular:</span>
            {campaigns.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                to={`/${c.slug}`}
                className="px-3 py-1 rounded-full text-xs glass border border-white/10 text-ink-300 hover:text-amber-400 hover:border-amber-400/30 transition-all"
              >
                {c.shortTitle}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-500">
          <div className="w-5 h-8 rounded-full border border-ink-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 divide-x divide-white/10">
          {[
            { icon: <Zap size={16} />, value: `${campaigns.length}+`, label: 'Active Campaigns' },
            { icon: <Star size={16} />, value: `${campaigns.reduce((a, c) => a + c.participantCount, 0).toLocaleString()}+`, label: 'DPs Generated' },
            { icon: <Sparkles size={16} />, value: '100%', label: 'Free Forever' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 py-2">
              <div className="text-amber-400 mb-1">{icon}</div>
              <div className="font-display text-xl font-bold text-ink-100">{value}</div>
              <div className="text-xs text-ink-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-100">Featured Events</h2>
            <p className="text-ink-500 mt-1 text-sm">Hand-picked campaigns to celebrate</p>
          </div>
          <Link to="/explore" className="flex items-center gap-1.5 text-amber-400 text-sm font-medium hover:gap-3 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((c, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp size={20} className="text-amber-400" />
          <h2 className="font-display text-3xl font-bold text-ink-100">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((c, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
        </div>
      </section>

      {/* Recent campaigns (from storage) */}
      {recentCampaigns.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-ink-400" />
            <h2 className="font-display text-2xl font-bold text-ink-100">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentCampaigns
              .map((slug) => campaigns.find((c) => c.slug === slug))
              .filter(Boolean)
              .slice(0, 4)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((c: any, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="glass border border-white/10 rounded-3xl p-8 sm:p-12">
          <h2 className="font-display text-3xl font-bold text-center text-ink-100 mb-2">How It Works</h2>
          <p className="text-center text-ink-500 text-sm mb-10">Three steps to your personalized DP</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Event', desc: 'Browse and select the event campaign you want to support.' },
              { step: '02', title: 'Personalize', desc: 'Upload your photo, enter your name, adjust position and zoom.' },
              { step: '03', title: 'Download & Share', desc: 'Download in HD and share on WhatsApp, Facebook, or X.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-sm font-bold text-amber-400">{step}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-100 mb-2">{title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
