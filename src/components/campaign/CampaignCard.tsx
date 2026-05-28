import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Heart, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatParticipantCount, timeUntilEvent } from '@/utils/frameGenerator';
import type { Campaign } from '@/config/campaigns';
import { cn } from '@/utils/cn';

interface Props {
  campaign: Campaign;
  index?: number;
}

export default function CampaignCard({ campaign, index = 0 }: Props) {
  const { favoriteCampaigns, toggleFavorite } = useAppStore();
  const isFav = favoriteCampaigns.includes(campaign.slug);
  const timeLeft = timeUntilEvent(campaign.eventDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/${campaign.slug}`} className="block">
        <div className="relative rounded-2xl overflow-hidden glass border border-white/10 card-hover">
          {/* Campaign preview banner */}
          <div
            className="relative h-40 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${campaign.themeColors.bg} 0%, ${campaign.themeColors.primary} 100%)` }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: campaign.themeColors.accent }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
              style={{ background: campaign.themeColors.secondary }} />

            {/* Logo text */}
            <div className="relative z-10 text-center">
              <div className="text-2xl font-display font-bold tracking-wider"
                style={{ color: campaign.themeColors.accent }}>
                {campaign.logoText}
              </div>
              <div className="mt-1 px-4 py-0.5 rounded-full text-xs font-medium border"
                style={{
                  color: campaign.themeColors.accent,
                  borderColor: campaign.themeColors.accent + '60',
                  background: campaign.themeColors.accent + '15'
                }}>
                {campaign.attendeeLabel}
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {campaign.trending && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-medium">
                  <TrendingUp size={10} />
                  Trending
                </span>
              )}
              {campaign.featured && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Category badge */}
            <div className="absolute top-3 right-10">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: campaign.themeColors.primary + '80',
                  color: campaign.themeColors.text,
                  border: `1px solid ${campaign.themeColors.primary}`
                }}>
                {campaign.category}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4">
            <h3 className="font-display text-base font-semibold leading-snug text-ink-100 group-hover:text-amber-400 transition-colors line-clamp-2 mb-3">
              {campaign.shortTitle}
            </h3>

            <div className="flex flex-col gap-1.5 text-xs text-ink-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} className="text-amber-400/70 flex-shrink-0" />
                <span className="truncate">{campaign.eventDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-amber-400/70 flex-shrink-0" />
                <span className="truncate">{campaign.venue}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-ink-500">
                <Users size={11} />
                <span>{formatParticipantCount(campaign.participantCount)} attending</span>
              </div>
              <span className="text-xs font-medium"
                style={{ color: campaign.themeColors.accent }}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(campaign.slug); }}
        className={cn(
          'absolute top-[11.5rem] right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-lg',
          isFav
            ? 'bg-red-500 text-white'
            : 'bg-ink-800/80 text-ink-400 hover:text-red-400 hover:bg-ink-700/80'
        )}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={14} className={cn(isFav && 'fill-current')} />
      </button>
    </motion.div>
  );
}
