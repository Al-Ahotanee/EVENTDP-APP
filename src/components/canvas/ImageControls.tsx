import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, RotateCw, RotateCcw, ZoomIn, ZoomOut, RefreshCw, User } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { Campaign } from '@/config/campaigns';
import { cn } from '@/utils/cn';

interface Props {
  campaign: Campaign;
}

export default function ImageControls({ campaign }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const store = useAppStore();
  const { canvas } = store;

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('Image must be under 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      store.setImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [store]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => store.setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [store]);

  const accent = campaign.themeColors.accent;

  return (
    <div className="space-y-5">
      {/* Photo upload */}
      <div>
        <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
          Your Photo
        </label>

        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group',
            canvas.imageDataUrl
              ? 'border-amber-400/40 bg-amber-400/5'
              : 'border-ink-600 hover:border-amber-400/40 hover:bg-amber-400/5'
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {canvas.imageDataUrl ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-400/30">
                <img src={canvas.imageDataUrl} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-amber-400">Photo uploaded!</p>
                <p className="text-xs text-ink-500">Click to change photo</p>
              </div>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto text-ink-400 group-hover:text-amber-400 transition-colors mb-2" />
              <p className="text-sm font-medium text-ink-300 group-hover:text-ink-100 transition-colors">
                Click or drag photo here
              </p>
              <p className="text-xs text-ink-500 mt-1">JPG, PNG, WEBP · Max 20MB</p>
            </>
          )}
        </div>
      </div>

      {/* Name input */}
      <div>
        <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
          Your Name
        </label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={canvas.attendeeName}
            onChange={(e) => {
              store.setAttendeeName(e.target.value);
              store.setLastAttendeeName(e.target.value);
            }}
            placeholder="Enter your full name"
            maxLength={40}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-ink-800 border border-ink-600 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 text-sm transition-all"
          />
        </div>
        <p className="text-xs text-ink-500 mt-1 text-right">{canvas.attendeeName.length}/40</p>
      </div>

      {/* Photo controls — only show when photo is uploaded */}
      {canvas.imageDataUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Zoom */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Zoom</label>
              <span className="text-xs text-ink-500 font-mono">{Math.round(canvas.imageScale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => store.setImageScale(canvas.imageScale - 0.1)}
                className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors"
              >
                <ZoomOut size={14} className="text-ink-200" />
              </button>
              <input
                type="range"
                min="0.1"
                max="4"
                step="0.05"
                value={canvas.imageScale}
                onChange={(e) => store.setImageScale(parseFloat(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accent }}
              />
              <button
                onClick={() => store.setImageScale(canvas.imageScale + 0.1)}
                className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors"
              >
                <ZoomIn size={14} className="text-ink-200" />
              </button>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Rotation</label>
              <span className="text-xs text-ink-500 font-mono">{Math.round(canvas.imageRotation)}°</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => store.setImageRotation(canvas.imageRotation - 15)}
                className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors"
              >
                <RotateCcw size={14} className="text-ink-200" />
              </button>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={canvas.imageRotation}
                onChange={(e) => store.setImageRotation(parseFloat(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accent }}
              />
              <button
                onClick={() => store.setImageRotation(canvas.imageRotation + 15)}
                className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors"
              >
                <RotateCw size={14} className="text-ink-200" />
              </button>
            </div>
          </div>

          <p className="text-xs text-ink-500 text-center">
            💡 Drag your photo inside the circle to reposition
          </p>

          {/* Reset photo */}
          <button
            onClick={() => store.setImage('')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-400/5 border border-ink-700 hover:border-red-400/30 text-sm transition-all"
          >
            <RefreshCw size={13} />
            Remove Photo
          </button>
        </motion.div>
      )}
    </div>
  );
}
