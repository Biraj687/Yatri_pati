import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * FrontendControlContext - Manages all frontend UI controls
 * Master Dashboard updates this context
 * Homepage, Navbar, Footer read from this context
 * All changes reflected in REAL-TIME
 */

interface HeroConfig {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  image: string;
  videoUrl: string;
  buttonText?: string;
  buttonLink?: string;
  buttonColor?: string;
  visible: boolean;
  autoPlay: boolean;
  duration: number;
}

interface NavbarConfig {
  logoText: string;
  logoColor: string;
  backgroundColor: string;
  textColor: string;
  sticky: boolean;
  searchEnabled: boolean;
  showCategories: boolean;
  categories: Array<{ name: string; visible: boolean }>;
}

interface Section {
  id: string;
  name: string;
  visible: boolean;
  layout: string;
  maxArticles: number;
}

interface Advertisement {
  id: number;
  name: string;
  image: string;
  link: string;
  position: string;
  visible: boolean;
}

interface FooterLink {
  name: string;
  url: string;
  visible: boolean;
}

interface FooterSocial {
  platform: string;
  url: string;
  visible: boolean;
}

interface FooterConfig {
  companyName: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  links: FooterLink[];
  social: FooterSocial[];
}

interface FrontendControlContextType {
  // Hero Section
  heroConfig: HeroConfig;
  updateHeroConfig: (config: Partial<HeroConfig>) => void;

  // Navbar
  navbarConfig: NavbarConfig;
  updateNavbarConfig: (config: Partial<NavbarConfig>) => void;

  // Sections
  sections: Section[];
  updateSection: (id: string, updates: Partial<Section>) => void;
  toggleSectionVisibility: (id: string) => void;

  // Advertisements
  advertisements: Advertisement[];
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => void;
  removeAdvertisement: (id: number) => void;
  updateAdvertisement: (id: number, updates: Partial<Advertisement>) => void;
  toggleAdVisibility: (id: number) => void;

  // Footer
  footerConfig: FooterConfig;
  updateFooterConfig: (config: Partial<FooterConfig>) => void;

  // Reset all
  resetAll: () => void;
}

const FrontendControlContext = createContext<FrontendControlContextType | undefined>(undefined);

const DEFAULT_HERO: HeroConfig = {
  title: 'Latest News',
  subtitle: 'Breaking Stories from Nepal',
  description: 'Stay updated with the latest news, tourism tips, and travel information',
  image: '',
  imageUrl: '',
  videoUrl: '',
  buttonText: 'Explore More',
  buttonLink: '/',
  buttonColor: '#3B82F6',
  visible: true,
  autoPlay: true,
  duration: 5,
};

const DEFAULT_NAVBAR: NavbarConfig = {
  logoText: 'Nepal Explain',
  logoColor: '#2563eb',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  sticky: true,
  searchEnabled: true,
  showCategories: true,
  categories: [
    { name: 'Politics', visible: true },
    { name: 'Tourism', visible: true },
    { name: 'Economy', visible: true },
    { name: 'Culture', visible: true },
    { name: 'Entertainment', visible: true },
  ],
};

const DEFAULT_SECTIONS: Section[] = [
  { id: 'latest', name: 'Latest News (समाचार)', visible: true, layout: 'featured-compact', maxArticles: 6 },
  { id: 'trending', name: 'Trending (विशेष सिफारिस)', visible: true, layout: 'grid-3', maxArticles: 3 },
  { id: 'packages', name: 'Packages (प्याकेज समाचार)', visible: true, layout: 'two-column', maxArticles: 6 },
  { id: 'hospitality', name: 'Hospitality (हस्पिटालिटि)', visible: true, layout: 'grid-4', maxArticles: 12 },
  { id: 'destinations', name: 'Destinations (गन्तव्य)', visible: true, layout: 'grid-3', maxArticles: 6 },
];

const DEFAULT_FOOTER: FooterConfig = {
  companyName: 'Nepal Explain Media',
  description: 'Your gateway to Nepal news and tourism',
  backgroundColor: '#1f2937',
  textColor: '#ffffff',
  links: [
    { name: 'About Us', url: '/about', visible: true },
    { name: 'Contact', url: '/contact', visible: true },
    { name: 'Privacy Policy', url: '/privacy', visible: true },
    { name: 'Terms & Conditions', url: '/terms', visible: true },
  ],
  social: [
    { platform: 'Facebook', url: 'https://facebook.com', visible: true },
    { platform: 'Twitter', url: 'https://twitter.com', visible: true },
    { platform: 'Instagram', url: 'https://instagram.com', visible: true },
  ],
};

export function FrontendControlProvider({ children }: { children: ReactNode }) {
  // Load from localStorage on mount
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    const stored = localStorage.getItem('nepal_explain_hero');
    return stored ? JSON.parse(stored) : DEFAULT_HERO;
  });

  const [navbarConfig, setNavbarConfig] = useState<NavbarConfig>(() => {
    const stored = localStorage.getItem('nepal_explain_navbar');
    return stored ? JSON.parse(stored) : DEFAULT_NAVBAR;
  });

  const [sections, setSections] = useState<Section[]>(() => {
    const stored = localStorage.getItem('nepal_explain_sections');
    return stored ? JSON.parse(stored) : DEFAULT_SECTIONS;
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const stored = localStorage.getItem('nepal_explain_banners');
    return stored ? JSON.parse(stored) : [];
  });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    const stored = localStorage.getItem('nepal_explain_footer');
    return stored ? JSON.parse(stored) : DEFAULT_FOOTER;
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('nepal_explain_hero', JSON.stringify(heroConfig));
  }, [heroConfig]);

  useEffect(() => {
    localStorage.setItem('nepal_explain_navbar', JSON.stringify(navbarConfig));
  }, [navbarConfig]);

  useEffect(() => {
    localStorage.setItem('nepal_explain_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('nepal_explain_banners', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('nepal_explain_footer', JSON.stringify(footerConfig));
  }, [footerConfig]);

  // Context value
  const value: FrontendControlContextType = {
    // Hero
    heroConfig,
    updateHeroConfig: (updates) => setHeroConfig((prev) => ({ ...prev, ...updates })),

    // Navbar
    navbarConfig,
    updateNavbarConfig: (updates) => setNavbarConfig((prev) => ({ ...prev, ...updates })),

    // Sections
    sections,
    updateSection: (id, updates) =>
      setSections((prev) =>
        prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
      ),
    toggleSectionVisibility: (id) =>
      setSections((prev) =>
        prev.map((sec) => (sec.id === id ? { ...sec, visible: !sec.visible } : sec))
      ),

    // Advertisements
    advertisements,
    addAdvertisement: (ad) =>
      setAdvertisements((prev) => [...prev, { ...ad, id: Date.now() }]),
    removeAdvertisement: (id) =>
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== id)),
    updateAdvertisement: (id, updates) =>
      setAdvertisements((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad))
      ),
    toggleAdVisibility: (id) =>
      setAdvertisements((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, visible: !ad.visible } : ad))
      ),

    // Footer
    footerConfig,
    updateFooterConfig: (updates) =>
      setFooterConfig((prev) => ({ ...prev, ...updates })),

    // Reset
    resetAll: () => {
      setHeroConfig(DEFAULT_HERO);
      setNavbarConfig(DEFAULT_NAVBAR);
      setSections(DEFAULT_SECTIONS);
      setAdvertisements([]);
      setFooterConfig(DEFAULT_FOOTER);
      localStorage.removeItem('nepal_explain_hero');
      localStorage.removeItem('nepal_explain_navbar');
      localStorage.removeItem('nepal_explain_sections');
      localStorage.removeItem('nepal_explain_banners');
      localStorage.removeItem('nepal_explain_footer');
    },
  };

  return (
    <FrontendControlContext.Provider value={value}>
      {children}
    </FrontendControlContext.Provider>
  );
}

export function useFrontendControl() {
  const context = useContext(FrontendControlContext);
  if (!context) {
    throw new Error('useFrontendControl must be used within FrontendControlProvider');
  }
  return context;
}

export { FrontendControlContext };
export default FrontendControlContext;
