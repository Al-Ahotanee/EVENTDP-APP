import type { Campaign } from '@/config/campaigns';

// Generates an inline SVG frame as a data URL for a given campaign
export function generateFrameDataUrl(campaign: Campaign, size = 1080): string {
  const { themeColors, attendeeLabel, logoText, eventDate, venue } = campaign;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="topGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${themeColors.primary}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${themeColors.bg}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${themeColors.bg}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${themeColors.primary}" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${themeColors.accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${themeColors.accent}" stop-opacity="0"/>
    </radialGradient>
    <mask id="circleMask">
      <rect width="1080" height="1080" fill="black"/>
      <circle cx="540" cy="490" r="345" fill="white"/>
    </mask>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="${themeColors.accent}" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1080" fill="${themeColors.bg}"/>

  <!-- Subtle radial glow -->
  <ellipse cx="540" cy="490" rx="500" ry="500" fill="url(#glowGrad)"/>

  <!-- Top banner -->
  <rect x="0" y="0" width="1080" height="120" fill="url(#topGrad)"/>

  <!-- Bottom banner -->
  <rect x="0" y="820" width="1080" height="260" fill="url(#bottomGrad)"/>

  <!-- Decorative ring around photo -->
  <circle cx="540" cy="490" r="360" fill="none" stroke="${themeColors.accent}" stroke-width="4" stroke-dasharray="20 10" opacity="0.6"/>
  <circle cx="540" cy="490" r="350" fill="none" stroke="${themeColors.primary}" stroke-width="8"/>

  <!-- Gold accent arcs -->
  <path d="M 200 490 A 340 340 0 0 1 880 490" fill="none" stroke="${themeColors.secondary}" stroke-width="3" opacity="0.3"/>

  <!-- Corner decorations -->
  <rect x="0" y="0" width="60" height="6" fill="${themeColors.accent}"/>
  <rect x="0" y="0" width="6" height="60" fill="${themeColors.accent}"/>
  <rect x="1020" y="0" width="60" height="6" fill="${themeColors.accent}"/>
  <rect x="1074" y="0" width="6" height="60" fill="${themeColors.accent}"/>
  <rect x="0" y="1074" width="60" height="6" fill="${themeColors.accent}"/>
  <rect x="0" y="1020" width="6" height="60" fill="${themeColors.accent}"/>
  <rect x="1020" y="1074" width="60" height="6" fill="${themeColors.accent}"/>
  <rect x="1074" y="1020" width="6" height="60" fill="${themeColors.accent}"/>

  <!-- Logo / event name top -->
  <text x="540" y="72" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="700" fill="${themeColors.accent}" letter-spacing="6">${logoText.toUpperCase()}</text>

  <!-- Divider line below logo -->
  <line x1="340" y1="85" x2="740" y2="85" stroke="${themeColors.accent}" stroke-width="1.5" opacity="0.5"/>

  <!-- Attendee label -->
  <rect x="290" y="835" width="500" height="44" rx="22" fill="${themeColors.accent}" opacity="0.15"/>
  <rect x="290" y="835" width="500" height="44" rx="22" fill="none" stroke="${themeColors.accent}" stroke-width="1.5"/>
  <text x="540" y="863" text-anchor="middle" font-family="'DM Sans', Arial, sans-serif" font-size="20" font-weight="700" fill="${themeColors.accent}" letter-spacing="4">${attendeeLabel}</text>

  <!-- Event date -->
  <text x="540" y="930" text-anchor="middle" font-family="'DM Sans', Arial, sans-serif" font-size="18" fill="${themeColors.text}" opacity="0.85">${eventDate}</text>

  <!-- Venue -->
  <text x="540" y="958" text-anchor="middle" font-family="'DM Sans', Arial, sans-serif" font-size="14" fill="${themeColors.text}" opacity="0.65">${venue}</text>

  <!-- FrameIt watermark -->
  <text x="540" y="1058" text-anchor="middle" font-family="'DM Sans', Arial, sans-serif" font-size="13" fill="${themeColors.text}" opacity="0.35" letter-spacing="3">FRAMEIT.APP</text>

  <!-- The photo area is a transparent hole - overlaid on user photo -->
  <!-- We mask out the circle to show user photo through it -->
  <rect width="1080" height="1080" fill="${themeColors.bg}" mask="url(#circleMask)"/>
</svg>`;

  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function formatParticipantCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function timeUntilEvent(dateStr: string): string {
  // Simple parser for display purposes
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  const parts = dateStr.replace(/\b(st|nd|rd|th)\b/g, '').split(/[,\s]+/).filter(Boolean);
  // e.g. ["Sunday", "May", "31", "2026"]
  const monthName = parts.find((p) => months[p] !== undefined) || 'May';
  const day = parseInt(parts.find((p) => /^\d{1,2}$/.test(p)) || '1');
  const year = parseInt(parts.find((p) => /^\d{4}$/.test(p)) || '2026');
  const eventDate = new Date(year, months[monthName], day);
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  if (diff <= 0) return 'Event passed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow!';
  if (days < 30) return `${days} days away`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks} weeks away`;
  const months2 = Math.floor(days / 30);
  return `${months2} months away`;
}
