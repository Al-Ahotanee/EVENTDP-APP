import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Sparkles, Tag, Clock } from 'lucide-react';
import { getCampaignBySlug } from '@/config/campaigns';
import { useAppStore } from '@/store/appStore';
import { generateFrameDataUrl, formatParticipantCount, timeUntilEvent } from '@/utils/frameGenerator';
import { generateQRDataUrl } from '@/utils/qrcode';
import CountdownTimer from '@/components/campaign/CountdownTimer';

export default function CampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const campaign = getCampaignBySlug(slug || '');
  const { addRecentCampaign, setCurrentCampaign, toggleFavorite, favoriteCampaigns, resetCanvas, lastAttendeeName, setAttendeeName } = useAppStore();

  useEffect(() => {
    if (!campaign) return;
    addRecentCampaign(campaign.slug);
    setCurrentCampaign(campaign);
    resetCanvas();
    if (lastAttendeeName) setAttendeeName(lastAttendeeName);
  }, [campaign?.slug]);

  if (!campaign) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="font-display text-3xl font-bold text-ink-100 mb-2">Campaign Not Found</h1>
        <p className="text-ink-500 mb-6">This campaign doesn't exist or has been removed.</p>
        <Link to="/explore" className="btn-gold px-6 py-3 rounded-xl text-sm inline-block">Browse Campaigns</Link>
      </div>
    );
  }

  const isFav = favoriteCampaigns.includes(campaign.slug);
  const frameUrl = generateFrameDataUrl(campaign, 1080);
  const qrUrl = generateQRDataUrl(`${window.location.origin}/${campaign.slug}`);
  const timeLeft = timeUntilEvent(campaign.eventDate);
  const campaignUrl = `${window.location.origin}/${campaign.slug}`;

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out this event: ${campaign.title}\n${campaignUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ink-400 hover:text-amber-400 transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Frame preview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          {/* Frame preview */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${campaign.themeColors.bg} 0%, ${campaign.themeColors.primary} 100%)` }}
          >
            <img src={frameUrl} alt="Campaign frame" className="w-full h-full object-cover" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {campaign.trending && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-medium">
                  🔥 Trending
                </span>
              )}
            </div>
          </div>

          {/* Countdown */}
          <div className="glass border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-amber-400" />
              <span className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Event Countdown</span>
            </div>
            <CountdownTimer eventDateStr={campaign.eventDate} accentColor={campaign.themeColors.accent} />
            <p className="text-center text-xs text-ink-500 mt-3">{timeLeft}</p>
          </div>

          {/* QR Code */}
          <div className="glass border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-amber-400" />
              <span className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Campaign QR Code</span>
            </div>
            <div className="flex items-center gap-4">
              <img src={qrUrl} alt="QR Code" className="w-20 h-20 rounded-lg border border-white/10" />
              <div>
                <p className="text-sm text-ink-300 font-medium mb-1">Scan to open</p>
                <p className="text-xs text-ink-500 break-all">{campaignUrl}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Campaign details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: campaign.themeColors.primary + '40', color: campaign.themeColors.accent, border: `1px solid ${campaign.themeColors.accent}40` }}>
              {campaign.category}
            </span>
            <span className="text-xs text-ink-500">
              <Users size={11} className="inline mr-1" />
              {formatParticipantCount(campaign.participantCount)} attending
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-100 leading-tight">
            {campaign.title}
          </h1>

          <p className="text-ink-400 leading-relaxed">{campaign.description}</p>

          {/* Event info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl glass border border-white/10">
              <Calendar size={16} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Date</p>
                <p className="text-sm font-medium text-ink-100">{campaign.eventDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass border border-white/10">
              <MapPin size={16} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Venue</p>
                <p className="text-sm font-medium text-ink-100">{campaign.venue}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-ink-500" />
            {campaign.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full glass border border-white/10 text-xs text-ink-400">
                #{tag}
              </span>
            ))}
          </div>

          {/* Tagline */}
          <div className="p-4 rounded-xl border"
            style={{ background: campaign.themeColors.primary + '20', borderColor: campaign.themeColors.accent + '30' }}>
            <p className="font-display text-lg font-semibold italic"
              style={{ color: campaign.themeColors.accent }}>
              "{campaign.tagline}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/${campaign.slug}/generate`}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl btn-gold text-base font-bold"
            >
              <Sparkles size={18} />
              Create My DP
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleFavorite(campaign.slug)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isFav
                    ? 'bg-red-500/15 border-red-500/30 text-red-400'
                    : 'glass border-white/10 text-ink-400 hover:text-red-400 hover:border-red-400/30'
                }`}
              >
                <Heart size={15} className={isFav ? 'fill-current' : ''} />
                {isFav ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 text-ink-400 hover:text-[#25D366] hover:border-[#25D366]/30 text-sm font-medium transition-all"
              >
                <Share2 size={15} />
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
