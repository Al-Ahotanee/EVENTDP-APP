import { useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers } from 'lucide-react';
import { getCampaignBySlug } from '@/config/campaigns';
import { useAppStore } from '@/store/appStore';
import DPCanvas from '@/components/canvas/DPCanvas';
import ImageControls from '@/components/canvas/ImageControls';
import ExportPanel from '@/components/canvas/ExportPanel';
import type Konva from 'konva';

export default function GeneratorPage() {
  const { slug } = useParams<{ slug: string }>();
  const campaign = getCampaignBySlug(slug || '');
  const { setCurrentCampaign, addRecentCampaign } = useAppStore();
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (!campaign) return;
    setCurrentCampaign(campaign);
    addRecentCampaign(campaign.slug);
    document.title = `Create DP – ${campaign.shortTitle} | FrameIt`;
    return () => { document.title = 'FrameIt – Event DP Generator'; };
  }, [campaign?.slug]);

  if (!campaign) return <Navigate to="/explore" replace />;

  return (
    <div className="min-h-screen" style={{ background: `${campaign.themeColors.bg}` }}>
      {/* Subtle colored background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at top, ${campaign.themeColors.primary}40 0%, transparent 60%)` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to={`/${campaign.slug}`}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-ink-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Layers size={14} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">DP Generator</span>
            </div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-ink-100 truncate">
              {campaign.shortTitle}
            </h1>
          </div>
          <div
            className="hidden sm:block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: campaign.themeColors.accent + '20', color: campaign.themeColors.accent, border: `1px solid ${campaign.themeColors.accent}40` }}
          >
            {campaign.attendeeLabel}
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Canvas preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <DPCanvas campaign={campaign} stageRef={stageRef} previewSize={580} />

            <p className="text-center text-xs text-ink-500">
              Live preview · Drag your photo to reposition
            </p>
          </motion.div>

          {/* Controls sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            {/* Image & Name controls */}
            <div className="glass border border-white/10 rounded-2xl p-5">
              <h2 className="font-display text-lg font-semibold text-ink-100 mb-4">Personalize</h2>
              <ImageControls campaign={campaign} />
            </div>

            {/* Export & Share */}
            <div className="glass border border-white/10 rounded-2xl p-5">
              <h2 className="font-display text-lg font-semibold text-ink-100 mb-4">Export & Share</h2>
              <ExportPanel campaign={campaign} />
            </div>

            {/* Campaign info summary */}
            <div
              className="rounded-2xl p-4 space-y-2"
              style={{ background: campaign.themeColors.primary + '20', border: `1px solid ${campaign.themeColors.accent}25` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: campaign.themeColors.accent }}>
                Event Details
              </p>
              <p className="text-xs text-ink-300">📅 {campaign.eventDate}</p>
              <p className="text-xs text-ink-300">📍 {campaign.venue}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
