import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Check, Link, MessageCircle, Facebook, Twitter, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { exportCanvasHD } from '@/components/canvas/DPCanvas';
import type { Campaign } from '@/config/campaigns';

interface Props {
  campaign: Campaign;
}

export default function ExportPanel({ campaign }: Props) {
  const { canvas } = useAppStore();
  const [exporting, setExporting] = useState<'png' | 'jpeg' | null>(null);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const campaignUrl = `${window.location.origin}/${campaign.slug}`;

  const doExport = async (format: 'png' | 'jpeg') => {
    if (!canvas.imageDataUrl && !canvas.attendeeName) {
      alert('Please upload a photo or enter your name first!');
      return;
    }
    setExporting(format);
    try {
      const dataUrl = await exportCanvasHD(
        campaign,
        canvas.attendeeName,
        canvas.imageDataUrl,
        canvas.imageX,
        canvas.imageY,
        canvas.imageScale,
        canvas.imageRotation,
        format
      );
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${campaign.slug}-dp.${format}`;
      link.click();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 ${campaign.attendeeLabel} – ${campaign.title}\n📅 ${campaign.eventDate}\n📍 ${campaign.venue}\n\nCreate yours: ${campaignUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${campaign.attendeeLabel} – ${campaign.shortTitle}\n${campaignUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = campaignUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNative = async () => {
    if (!navigator.share) { shareOnWhatsApp(); return; }
    try {
      await navigator.share({
        title: campaign.title,
        text: `${campaign.attendeeLabel} – ${campaign.title}`,
        url: campaignUrl,
      });
    } catch { /* user cancelled */ }
  };

  return (
    <div className="space-y-4">
      {/* Success toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm"
          >
            <Check size={15} />
            DP downloaded successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download buttons */}
      <div>
        <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
          Download HD
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => doExport('png')}
            disabled={!!exporting}
            className="flex items-center justify-center gap-2 py-3 rounded-xl btn-gold text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting === 'png' ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            PNG
          </button>
          <button
            onClick={() => doExport('jpeg')}
            disabled={!!exporting}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-ink-700 hover:bg-ink-600 text-ink-100 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {exporting === 'jpeg' ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            JPG
          </button>
        </div>
        <p className="text-xs text-ink-500 mt-1.5 text-center">
          HD 1080×1080px · Perfect for WhatsApp DP
        </p>
      </div>

      {/* Share buttons */}
      <div>
        <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
          Share Campaign
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/25 transition-all"
          >
            <MessageCircle size={15} />
            WhatsApp
          </button>
          <button
            onClick={shareOnFacebook}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/30 text-[#1877F2] text-sm font-medium hover:bg-[#1877F2]/25 transition-all"
          >
            <Facebook size={15} />
            Facebook
          </button>
          <button
            onClick={shareOnTwitter}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-700 hover:bg-ink-600 text-ink-200 text-sm font-medium transition-colors"
          >
            <Twitter size={15} />
            X / Twitter
          </button>
          <button
            onClick={shareNative}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-700 hover:bg-ink-600 text-ink-200 text-sm font-medium transition-colors"
          >
            <Share2 size={15} />
            More
          </button>
        </div>
      </div>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-800 border border-ink-600 hover:border-amber-400/40 text-ink-300 hover:text-amber-400 text-sm transition-all"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Link size={14} />}
        {copied ? 'Link copied!' : 'Copy campaign link'}
      </button>
    </div>
  );
}
