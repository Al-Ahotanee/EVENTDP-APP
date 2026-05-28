export interface Campaign {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  tagline: string;
  eventDate: string;
  venue: string;
  category: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    bg: string;
  };
  frameUrl: string;
  logoText: string;
  attendeeLabel: string;
  exportSize: { width: number; height: number };
  typography: {
    nameFont: string;
    nameFontSize: number;
    nameColor: string;
    labelFont: string;
    labelFontSize: number;
    labelColor: string;
  };
  frameStyle: {
    namePosition: { x: number; y: number };
    labelPosition: { x: number; y: number };
    photoPosition: { x: number; y: number };
    photoRadius: number;
  };
  tags: string[];
  featured: boolean;
  trending: boolean;
  participantCount: number;
  createdAt: string;
}

export const campaigns: Campaign[] = [
  {
    id: 'gss-aujara-2012',
    slug: 'gss-aujara-2012',
    title: 'Government Secondary School Aujara Old Boys Reunion 2012',
    shortTitle: 'GSS Aujara Reunion 2012',
    description: 'Join us for a grand reunion of the 2012 graduating set of Government Secondary School Aujara. Reconnect with old classmates, celebrate achievements, and create lasting memories.',
    tagline: 'Once a Lion, Always a Lion',
    eventDate: 'Sunday, May 31st 2026',
    venue: 'Government Secondary School Aujara',
    category: 'Reunion',
    themeColors: {
      primary: '#1B5E20',
      secondary: '#F9A825',
      accent: '#FFD600',
      text: '#FFFFFF',
      bg: '#0D2B0D',
    },
    frameUrl: '/frames/gss-aujara-frame.svg',
    logoText: 'GSS Aujara',
    attendeeLabel: "I'M ATTENDING",
    exportSize: { width: 1080, height: 1080 },
    typography: {
      nameFont: 'Playfair Display',
      nameFontSize: 42,
      nameColor: '#FFD600',
      labelFont: 'DM Sans',
      labelFontSize: 22,
      labelColor: '#FFFFFF',
    },
    frameStyle: {
      namePosition: { x: 540, y: 900 },
      labelPosition: { x: 540, y: 960 },
      photoPosition: { x: 540, y: 490 },
      photoRadius: 340,
    },
    tags: ['reunion', 'school', 'jigawa', 'nigeria', '2012'],
    featured: true,
    trending: true,
    participantCount: 247,
    createdAt: '2026-01-15',
  },
  {
    id: 'tech-summit-abuja-2026',
    slug: 'tech-summit-abuja-2026',
    title: 'Abuja Tech Summit 2026',
    shortTitle: 'Abuja Tech Summit',
    description: 'The premier technology conference bringing together innovators, developers, and entrepreneurs across Nigeria and Africa.',
    tagline: 'Building Africa\'s Digital Future',
    eventDate: 'Friday, June 20th 2026',
    venue: 'International Conference Centre, Abuja',
    category: 'Conference',
    themeColors: {
      primary: '#0D47A1',
      secondary: '#00BCD4',
      accent: '#00E5FF',
      text: '#FFFFFF',
      bg: '#050D1F',
    },
    frameUrl: '/frames/tech-summit-frame.svg',
    logoText: 'ATS 2026',
    attendeeLabel: "I'M SPEAKING",
    exportSize: { width: 1080, height: 1080 },
    typography: {
      nameFont: 'DM Sans',
      nameFontSize: 40,
      nameColor: '#00E5FF',
      labelFont: 'DM Sans',
      labelFontSize: 20,
      labelColor: '#FFFFFF',
    },
    frameStyle: {
      namePosition: { x: 540, y: 900 },
      labelPosition: { x: 540, y: 950 },
      photoPosition: { x: 540, y: 490 },
      photoRadius: 320,
    },
    tags: ['tech', 'conference', 'abuja', 'innovation', 'nigeria'],
    featured: true,
    trending: false,
    participantCount: 1243,
    createdAt: '2026-02-01',
  },
  {
    id: 'nigeria-democracy-day-2026',
    slug: 'nigeria-democracy-day-2026',
    title: 'Nigeria Democracy Day Celebration 2026',
    shortTitle: 'Democracy Day 2026',
    description: 'Celebrating 27 years of democracy in Nigeria. Join millions of Nigerians in marking this historic milestone.',
    tagline: 'We The People',
    eventDate: 'Wednesday, June 12th 2026',
    venue: 'Eagle Square, Abuja',
    category: 'National Event',
    themeColors: {
      primary: '#006600',
      secondary: '#FFFFFF',
      accent: '#008000',
      text: '#FFFFFF',
      bg: '#001A00',
    },
    frameUrl: '/frames/democracy-day-frame.svg',
    logoText: 'Nigeria',
    attendeeLabel: 'PROUD NIGERIAN',
    exportSize: { width: 1080, height: 1080 },
    typography: {
      nameFont: 'Playfair Display',
      nameFontSize: 38,
      nameColor: '#FFFFFF',
      labelFont: 'DM Sans',
      labelFontSize: 20,
      labelColor: '#00E676',
    },
    frameStyle: {
      namePosition: { x: 540, y: 900 },
      labelPosition: { x: 540, y: 955 },
      photoPosition: { x: 540, y: 490 },
      photoRadius: 330,
    },
    tags: ['democracy', 'nigeria', 'patriotic', 'june12', 'celebration'],
    featured: false,
    trending: true,
    participantCount: 8921,
    createdAt: '2026-04-01',
  },
  {
    id: 'jigawa-gov-cup-2026',
    slug: 'jigawa-gov-cup-2026',
    title: 'Jigawa Governor\'s Cup Football Tournament 2026',
    shortTitle: "Jigawa Gov's Cup 2026",
    description: 'The most anticipated football tournament in Jigawa State. Support your local team and show your pride!',
    tagline: 'Football for Development',
    eventDate: 'Saturday, July 4th 2026',
    venue: 'Dutse Stadium, Jigawa State',
    category: 'Sports',
    themeColors: {
      primary: '#BF360C',
      secondary: '#FFF9C4',
      accent: '#FF6D00',
      text: '#FFFFFF',
      bg: '#1A0A00',
    },
    frameUrl: '/frames/football-frame.svg',
    logoText: "Gov's Cup",
    attendeeLabel: 'I SUPPORT FOOTBALL',
    exportSize: { width: 1080, height: 1080 },
    typography: {
      nameFont: 'DM Sans',
      nameFontSize: 38,
      nameColor: '#FF6D00',
      labelFont: 'DM Sans',
      labelFontSize: 19,
      labelColor: '#FFFFFF',
    },
    frameStyle: {
      namePosition: { x: 540, y: 900 },
      labelPosition: { x: 540, y: 950 },
      photoPosition: { x: 540, y: 490 },
      photoRadius: 320,
    },
    tags: ['football', 'sports', 'jigawa', 'tournament', 'dutse'],
    featured: false,
    trending: true,
    participantCount: 3456,
    createdAt: '2026-03-10',
  },
];

export const getCampaignBySlug = (slug: string): Campaign | undefined =>
  campaigns.find((c) => c.slug === slug);

export const getFeaturedCampaigns = (): Campaign[] =>
  campaigns.filter((c) => c.featured);

export const getTrendingCampaigns = (): Campaign[] =>
  campaigns.filter((c) => c.trending);

export const searchCampaigns = (query: string): Campaign[] => {
  const q = query.toLowerCase();
  return campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q)) ||
      c.venue.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
};
