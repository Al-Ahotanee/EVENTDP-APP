import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, TrendingUp } from 'lucide-react';
import { campaigns, searchCampaigns } from '@/config/campaigns';
import { useAppStore } from '@/store/appStore';
import CampaignCard from '@/components/campaign/CampaignCard';

const CATEGORIES = ['All', 'Reunion', 'Conference', 'Sports', 'National Event', 'Religious', 'Cultural'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('All');
  const [tab, setTab] = useState<'all' | 'trending' | 'favorites'>('all');
  const { favoriteCampaigns } = useAppStore();

  const results = (() => {
    let base = query.trim().length >= 2 ? searchCampaigns(query) : campaigns;
    if (category !== 'All') base = base.filter((c) => c.category === category);
    if (tab === 'trending') base = base.filter((c) => c.trending);
    if (tab === 'favorites') base = base.filter((c) => favoriteCampaigns.includes(c.slug));
    return base;
  })();

  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink-100 mb-2">Explore Campaigns</h1>
        <p className="text-ink-400">Discover events and create your personalized DP</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, location, category..."
          className="w-full pl-12 pr-6 py-4 rounded-2xl glass border border-white/15 focus:border-amber-400/40 focus:outline-none text-ink-100 placeholder-ink-500 text-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { key: 'all', label: 'All Events', icon: <Filter size={13} /> },
          { key: 'trending', label: 'Trending', icon: <TrendingUp size={13} /> },
          { key: 'favorites', label: `Favorites (${favoriteCampaigns.length})`, icon: <Heart size={13} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as 'all' | 'trending' | 'favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? 'bg-amber-400/10 border border-amber-400/30 text-amber-400'
                : 'glass border border-white/10 text-ink-400 hover:text-ink-100'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat
                ? 'bg-amber-400 text-black'
                : 'glass border border-white/10 text-ink-400 hover:text-ink-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-semibold text-ink-300 mb-2">No campaigns found</h3>
          <p className="text-ink-500 text-sm">Try a different search or category</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-ink-500 mb-4">{results.length} campaign{results.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((c, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
          </div>
        </>
      )}
    </div>
  );
}
