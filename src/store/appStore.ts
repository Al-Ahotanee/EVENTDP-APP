import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Campaign } from '@/config/campaigns';

interface CanvasState {
  imageDataUrl: string | null;
  imageX: number;
  imageY: number;
  imageScale: number;
  imageRotation: number;
  attendeeName: string;
  isDragging: boolean;
}

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Canvas
  canvas: CanvasState;
  setImage: (dataUrl: string) => void;
  setImagePosition: (x: number, y: number) => void;
  setImageScale: (scale: number) => void;
  setImageRotation: (rotation: number) => void;
  setAttendeeName: (name: string) => void;
  setIsDragging: (v: boolean) => void;
  resetCanvas: () => void;

  // Campaigns
  currentCampaign: Campaign | null;
  setCurrentCampaign: (c: Campaign | null) => void;
  recentCampaigns: string[];
  addRecentCampaign: (slug: string) => void;
  favoriteCampaigns: string[];
  toggleFavorite: (slug: string) => void;

  // User prefs
  lastAttendeeName: string;
  setLastAttendeeName: (name: string) => void;
}

const defaultCanvas: CanvasState = {
  imageDataUrl: null,
  imageX: 0,
  imageY: 0,
  imageScale: 1,
  imageRotation: 0,
  attendeeName: '',
  isDragging: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: true,
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        document.documentElement.classList.toggle('dark', next);
      },

      canvas: defaultCanvas,
      setImage: (dataUrl) =>
        set((s) => ({ canvas: { ...s.canvas, imageDataUrl: dataUrl, imageX: 0, imageY: 0, imageScale: 1, imageRotation: 0 } })),
      setImagePosition: (x, y) =>
        set((s) => ({ canvas: { ...s.canvas, imageX: x, imageY: y } })),
      setImageScale: (scale) =>
        set((s) => ({ canvas: { ...s.canvas, imageScale: Math.max(0.1, Math.min(4, scale)) } })),
      setImageRotation: (rotation) =>
        set((s) => ({ canvas: { ...s.canvas, imageRotation: rotation } })),
      setAttendeeName: (name) =>
        set((s) => ({ canvas: { ...s.canvas, attendeeName: name } })),
      setIsDragging: (v) =>
        set((s) => ({ canvas: { ...s.canvas, isDragging: v } })),
      resetCanvas: () => set({ canvas: defaultCanvas }),

      currentCampaign: null,
      setCurrentCampaign: (c) => set({ currentCampaign: c }),

      recentCampaigns: [],
      addRecentCampaign: (slug) =>
        set((s) => ({
          recentCampaigns: [slug, ...s.recentCampaigns.filter((x) => x !== slug)].slice(0, 10),
        })),

      favoriteCampaigns: [],
      toggleFavorite: (slug) =>
        set((s) => ({
          favoriteCampaigns: s.favoriteCampaigns.includes(slug)
            ? s.favoriteCampaigns.filter((x) => x !== slug)
            : [...s.favoriteCampaigns, slug],
        })),

      lastAttendeeName: '',
      setLastAttendeeName: (name) => set({ lastAttendeeName: name }),
    }),
    {
      name: 'frameit-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        recentCampaigns: state.recentCampaigns,
        favoriteCampaigns: state.favoriteCampaigns,
        lastAttendeeName: state.lastAttendeeName,
      }),
    }
  )
);
