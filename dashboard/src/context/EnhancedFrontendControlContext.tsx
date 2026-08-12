/**
 * Enhanced Frontend Control Context
 * Manages ALL frontend content: navbar, hero, categories, articles, settings
 * Single source of truth for dashboard
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============= TYPE DEFINITIONS =============

export interface NavbarLink {
  id: string;
  label: string;
  url: string;
  order: number;
  active: boolean;
}

export interface NavbarConfig {
  id: string;
  logo: string;
  logoFile?: File;
  title: string;
  links: NavbarLink[];
  backgroundColor: string;
  textColor: string;
  sticky: boolean;
}

export interface HeroConfig {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFile?: File;
  videoUrl?: string;
  videoFile?: File;
  backgroundColor: string;
  overlayOpacity: number;
  active: boolean;
}

export interface Article {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  imageFile?: File;
  thumbnailUrl?: string;
  thumbnailFile?: File;
  videoUrl?: string;
  videoFile?: File;
  author: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  relatedArticleIds?: string[]; // For side/related articles
}

export interface Category {
  id: string;
  name: string;
  order: number;
  icon?: string;
  iconFile?: File;
  description: string;
  visible: boolean;
  articles: Article[];
  color?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  faviconUrl?: string;
  faviconFile?: File;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSizeBase: number;
}

export interface FrontendControlContextType {
  // STATE
  navbar: NavbarConfig;
  hero: HeroConfig;
  categories: Category[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  unsavedChanges: boolean;

  // NAVBAR OPERATIONS
  updateNavbar: (navbar: Partial<NavbarConfig>) => void;
  addNavbarLink: (link: Omit<NavbarLink, 'id' | 'order'>) => void;
  removeNavbarLink: (linkId: string) => void;
  updateNavbarLink: (linkId: string, updates: Partial<NavbarLink>) => void;
  reorderNavbarLinks: (newOrder: NavbarLink[]) => void;

  // HERO OPERATIONS
  updateHero: (hero: Partial<HeroConfig>) => void;
  uploadHeroImage: (file: File) => void;
  uploadHeroVideo: (file: File) => void;

  // CATEGORY OPERATIONS
  addCategory: (category: Omit<Category, 'id' | 'articles'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (newOrder: Category[]) => void;
  duplicateCategory: (categoryId: string) => void;
  toggleCategoryVisibility: (categoryId: string) => void;

  // ARTICLE OPERATIONS
  addArticle: (categoryId: string, article: Omit<Article, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'>) => void;
  updateArticle: (articleId: string, updates: Partial<Article>) => void;
  deleteArticle: (articleId: string) => void;
  reorderArticles: (categoryId: string, newOrder: Article[]) => void;
  setFeaturedArticle: (categoryId: string, articleId: string) => void;
  addRelatedArticle: (articleId: string, relatedArticleId: string) => void;
  removeRelatedArticle: (articleId: string, relatedArticleId: string) => void;

  // SETTINGS OPERATIONS
  updateSettings: (settings: Partial<SiteSettings>) => void;

  // UTILITY OPERATIONS
  saveAllChanges: () => Promise<void>;
  loadAllData: () => Promise<void>;
  clearError: () => void;
  getArticlesByCategory: (categoryId: string) => Article[];
  getCategory: (categoryId: string) => Category | undefined;
}

// ============= CONTEXT =============

const FrontendControlContext = createContext<FrontendControlContextType | undefined>(undefined);

// ============= PROVIDER =============

export function EnhancedFrontendControlProvider({ children }: { children: ReactNode }) {
  // Initialize state with default values
  const [navbar, setNavbar] = useState<NavbarConfig>({
    id: 'navbar-1',
    logo: '/logo.svg',
    title: 'Nepal Explain',
    links: [
      { id: '1', label: 'Home', url: '/', order: 1, active: true },
      { id: '2', label: 'News', url: '/news', order: 2, active: true },
      { id: '3', label: 'About', url: '/about', order: 3, active: true },
    ],
    backgroundColor: '#ffffff',
    textColor: '#000000',
    sticky: true,
  });

  const [hero, setHero] = useState<HeroConfig>({
    id: 'hero-1',
    title: 'Welcome to Nepal Explain',
    description: 'Your gateway to Nepal',
    imageUrl: '/hero-image.jpg',
    backgroundColor: '#000000',
    overlayOpacity: 0.4,
    active: true,
  });

  const [settings, setSettings] = useState<SiteSettings>({
    id: 'settings-1',
    siteName: 'Nepal Explain',
    siteDescription: 'News and Travel Portal',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    fontFamily: 'Inter, sans-serif',
    fontSizeBase: 16,
  });

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat-1',
      name: 'ताजा समाचार',
      order: 1,
      description: 'Latest news',
      visible: true,
      articles: [],
      color: '#FF6B6B',
    },
    {
      id: 'cat-2',
      name: 'विशेष सिफारिस',
      order: 2,
      description: 'Special recommendations',
      visible: true,
      articles: [],
      color: '#4ECDC4',
    },
    {
      id: 'cat-3',
      name: 'गन्तव्य',
      order: 3,
      description: 'Destinations',
      visible: true,
      articles: [],
      color: '#45B7D1',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // ============= NAVBAR OPERATIONS =============

  const updateNavbar = useCallback((updates: Partial<NavbarConfig>) => {
    setNavbar((prev) => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  }, []);

  const addNavbarLink = useCallback((link: Omit<NavbarLink, 'id' | 'order'>) => {
    setNavbar((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          ...link,
          id: `link-${Date.now()}`,
          order: prev.links.length + 1,
        },
      ],
    }));
    setUnsavedChanges(true);
  }, []);

  const removeNavbarLink = useCallback((linkId: string) => {
    setNavbar((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== linkId),
    }));
    setUnsavedChanges(true);
  }, []);

  const updateNavbarLink = useCallback((linkId: string, updates: Partial<NavbarLink>) => {
    setNavbar((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)),
    }));
    setUnsavedChanges(true);
  }, []);

  const reorderNavbarLinks = useCallback((newOrder: NavbarLink[]) => {
    setNavbar((prev) => ({
      ...prev,
      links: newOrder.map((link, index) => ({ ...link, order: index + 1 })),
    }));
    setUnsavedChanges(true);
  }, []);

  // ============= HERO OPERATIONS =============

  const updateHero = useCallback((updates: Partial<HeroConfig>) => {
    setHero((prev) => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  }, []);

  const uploadHeroImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setHero((prev) => ({
        ...prev,
        imageUrl: e.target?.result as string,
        imageFile: file,
      }));
      setUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadHeroVideo = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setHero((prev) => ({
        ...prev,
        videoUrl: e.target?.result as string,
        videoFile: file,
      }));
      setUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // ============= CATEGORY OPERATIONS =============

  const addCategory = useCallback((category: Omit<Category, 'id' | 'articles'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      articles: [],
      order: Math.max(...categories.map((c) => c.order), 0) + 1,
    };
    setCategories((prev) => [...prev, newCategory]);
    setUnsavedChanges(true);
  }, [categories]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c))
    );
    setUnsavedChanges(true);
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setUnsavedChanges(true);
  }, []);

  const reorderCategories = useCallback((newOrder: Category[]) => {
    setCategories(
      newOrder.map((cat, index) => ({ ...cat, order: index + 1 }))
    );
    setUnsavedChanges(true);
  }, []);

  const duplicateCategory = useCallback((categoryId: string) => {
    const categoryToDuplicate = categories.find((c) => c.id === categoryId);
    if (!categoryToDuplicate) return;

    const duplicated: Category = {
      ...categoryToDuplicate,
      id: `cat-${Date.now()}`,
      name: `${categoryToDuplicate.name} (Copy)`,
      articles: categoryToDuplicate.articles.map((a) => ({
        ...a,
        id: `art-${Date.now()}-${Math.random()}`,
      })),
      order: Math.max(...categories.map((c) => c.order), 0) + 1,
    };
    setCategories((prev) => [...prev, duplicated]);
    setUnsavedChanges(true);
  }, [categories]);

  const toggleCategoryVisibility = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, visible: !c.visible } : c
      )
    );
    setUnsavedChanges(true);
  }, []);

  // ============= ARTICLE OPERATIONS =============

  const addArticle = useCallback(
    (categoryId: string, article: Omit<Article, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'>) => {
      const newArticle: Article = {
        ...article,
        id: `art-${Date.now()}`,
        categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, articles: [...c.articles, newArticle] }
            : c
        )
      );
      setUnsavedChanges(true);
    },
    []
  );

  const updateArticle = useCallback((articleId: string, updates: Partial<Article>) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        articles: c.articles.map((a) =>
          a.id === articleId
            ? { ...a, ...updates, updatedAt: new Date().toISOString() }
            : a
        ),
      }))
    );
    setUnsavedChanges(true);
  }, []);

  const deleteArticle = useCallback((articleId: string) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        articles: c.articles.filter((a) => a.id !== articleId),
      }))
    );
    setUnsavedChanges(true);
  }, []);

  const reorderArticles = useCallback((categoryId: string, newOrder: Article[]) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              articles: newOrder.map((a, index) => ({ ...a, order: index + 1 })),
            }
          : c
      )
    );
    setUnsavedChanges(true);
  }, []);

  const setFeaturedArticle = useCallback((categoryId: string, articleId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              articles: c.articles.map((a) => ({
                ...a,
                featured: a.id === articleId,
              })),
            }
          : c
      )
    );
    setUnsavedChanges(true);
  }, []);

  const addRelatedArticle = useCallback((articleId: string, relatedArticleId: string) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        articles: c.articles.map((a) =>
          a.id === articleId
            ? {
                ...a,
                relatedArticleIds: [
                  ...(a.relatedArticleIds || []),
                  relatedArticleId,
                ],
              }
            : a
        ),
      }))
    );
    setUnsavedChanges(true);
  }, []);

  const removeRelatedArticle = useCallback((articleId: string, relatedArticleId: string) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        articles: c.articles.map((a) =>
          a.id === articleId
            ? {
                ...a,
                relatedArticleIds: a.relatedArticleIds?.filter(
                  (id) => id !== relatedArticleId
                ),
              }
            : a
        ),
      }))
    );
    setUnsavedChanges(true);
  }, []);

  // ============= SETTINGS OPERATIONS =============

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  }, []);

  // ============= UTILITY OPERATIONS =============

  const saveAllChanges = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Send all changes to API
      console.log('Saving all changes:', {
        navbar,
        hero,
        categories,
        settings,
      });
      setUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  }, [navbar, hero, categories, settings]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Load all data from API
      console.log('Loading all data from API');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getArticlesByCategory = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      return category?.articles || [];
    },
    [categories]
  );

  const getCategory = useCallback(
    (categoryId: string) => {
      return categories.find((c) => c.id === categoryId);
    },
    [categories]
  );

  const value: FrontendControlContextType = {
    navbar,
    hero,
    categories,
    settings,
    loading,
    error,
    unsavedChanges,
    updateNavbar,
    addNavbarLink,
    removeNavbarLink,
    updateNavbarLink,
    reorderNavbarLinks,
    updateHero,
    uploadHeroImage,
    uploadHeroVideo,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    duplicateCategory,
    toggleCategoryVisibility,
    addArticle,
    updateArticle,
    deleteArticle,
    reorderArticles,
    setFeaturedArticle,
    addRelatedArticle,
    removeRelatedArticle,
    updateSettings,
    saveAllChanges,
    loadAllData,
    clearError,
    getArticlesByCategory,
    getCategory,
  };

  return (
    <FrontendControlContext.Provider value={value}>
      {children}
    </FrontendControlContext.Provider>
  );
}

// ============= HOOK =============

export function useEnhancedFrontendControl(): FrontendControlContextType {
  const context = useContext(FrontendControlContext);
  if (!context) {
    throw new Error(
      'useEnhancedFrontendControl must be used within EnhancedFrontendControlProvider'
    );
  }
  return context;
}
