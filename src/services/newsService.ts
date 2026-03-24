import ppImage from '../assets/pp.jpg';
import heroImage from '../assets/hero.jpg';
import thumbnailImage from '../assets/thumbnail.jpg';
import thumbnail2 from '../assets/thumbnail 2.jpg';
import thumbnail3 from '../assets/thumbnail 3.jpg';
import { apiClient } from './apiClient';
import { sanitizeArticle } from './sanitizer';
import type { RawArticle, NewsApiResponse, Article, SiteConfig } from '../types';

// Local type for news data response (different from generic ApiResponse<T> in types)
export interface NewsDataResponse {
  hero: Article | null;
  featured: Article | null;
  articles: Article[];
}

// Normalization function to handle backend dataset variation
export function normalizeArticle(rawArticle?: RawArticle | null): Article | null {
  if (!rawArticle) return null;
  
  // Clean date by removing trailing " 0" if present
  let cleanedDate = rawArticle.date || rawArticle.published_at || rawArticle.createdAt || rawArticle.publishedDate || new Date().toLocaleDateString('ne-NP');
  if (cleanedDate) {
    cleanedDate = cleanedDate.replace(/ 0$/, '');
  }
  
  const article: Article = {
    id: rawArticle.id || rawArticle._id || rawArticle.articleId || Math.random(),
    title: rawArticle.title || rawArticle.headline || rawArticle.name || '',
    image: rawArticle.image || rawArticle.thumbnail || rawArticle.thumb || rawArticle.imageUrl || '',
    excerpt: rawArticle.excerpt || rawArticle.summary || rawArticle.description || rawArticle.intro || '',
    author: rawArticle.author || rawArticle.writer || rawArticle.authorName || 'बिराज प्याकुरेल',
    date: cleanedDate,
    category: rawArticle.category || rawArticle.type || rawArticle.channel || rawArticle.section || 'समाचार',
    authorAvatar: rawArticle.authorAvatar || rawArticle.avatar || rawArticle.profileImage || ppImage,
    content: rawArticle.content || rawArticle.body || rawArticle.article || undefined,
    readTime: rawArticle.readTime || rawArticle.estimatedReadTime || calculateReadTime(rawArticle.content || rawArticle.excerpt || ''),
    views: rawArticle.views || rawArticle.viewCount || 0,
    source: rawArticle.source || rawArticle.publisher || rawArticle.publication || undefined
  };
  
  return article;
}

// Calculate estimated read time based on word count
function calculateReadTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) return 'कम पढ्नु';
  if (minutes === 1) return '१ मिनेट पढ्नु';
  return `${minutes} मिनेट पढ्नु`;
}

// Mock backend data with fixed images and pp.jpg author avatars
const mockHeroArticle = {
  id: 'hero-1',
  headline: 'जहाँ जहाँ जान्छौ तिमि, म पाइला बनि पछ्याई रहन्छु',
  image: heroImage,
  summary: 'एक अनौठो कथा जो तपाईंको हृदय छुने छ र जीवनको अर्थ सिखाउँछ।',
  writer: 'बिराज प्याकुरेल',
  published_at: '२२ फाल्गुन २०८२, बुधबार — २ दिन पहिले',
  category: 'पाइला'
};

const mockFeaturedArticle = {
  id: 'featured-1',
  title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराखु र केही पनि नमाग्रु नै स्वतन्त्रता हो।',
  image: thumbnailImage,
  excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलियिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
  author: 'बिराज प्याकुरेल',
  date: '२२ भदौ २०७९, बुधबार'
};

export const mockTargetArticles = [
  {
    id: 1,
    title: 'प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ',
    image: thumbnailImage,
    summary: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२२ भदौ २०७९, बुधबार'
  },
  {
    id: 2,
    headline: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराखु र केही पनि नमाग्रु नै स्वतन्त्रता हो।',
    image: thumbnail2,
    excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    writer: 'बिराज प्याकुरेल',
    date: '२२ भदौ २०७९, बुधबार'
  },
  {
    id: 3,
    title: 'संग्राममा हजारौं हजारलाई जिनेलाई भन्दा आफ्नो मनलाई जित सक्नेलाई संग्राम विजयी भनिन्छ',
    image: thumbnail3,
    summary: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२२ भदौ २०७९, बुधबार'
  },
  {
    id: 4,
    title: 'आत्मा भित्र अनन्त शक्तिको स्रोत छैन र हामीले यो पावर जाग्रत गर्न सक्छौं',
    image: thumbnailImage,
    excerpt: 'आपनो अन्दरको शक्तिलाई चिनेर सफलतार्थ अग्रसर हुनुहोस्।',
    author: 'बिराज प्याकुरेल',
    published_at: '२१ भदौ २०७९, मङ्गलबार'
  },
  {
    id: 5,
    title: 'तपाईंको भविष्य तपाईंको सोचद्वारा तय हुन्छ, सकारात्मक सोच ग्रहण गर्नुहोस्',
    image: thumbnail2,
    summary: 'जीवनमा सफलताको मुख्य कुञ्जी सकारात्मक सोचमा निहित छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२० भदौ २०७९, सोमबार'
  },
  {
    id: 6,
    title: 'होटल र रिसोर्ट: नेपालको पर्यटन उद्योगमा नयाँ आयाम',
    image: thumbnail3,
    excerpt: 'नेपालका प्रमुख पर्यटकीय स्थलहरूमा विलासी होटल र रिसोर्टहरूको विस्तार हुँदैछ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२० फाल्गुन २०८२'
  },
  {
    id: 7,
    title: 'हिमाली भेगमा ट्रेकिङका लागि उत्तम समय',
    image: thumbnailImage,
    excerpt: 'यस वर्षको वसन्त ऋतु ट्रेकिङका लागि निकै अनुकूल मानिएको छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '१९ फाल्गुन २०८२'
  },
  {
    id: 8,
    title: 'काठमाडौं भित्रका उत्कृष्ट रेस्टुरेन्टहरू',
    image: thumbnail2,
    excerpt: 'खानाका पारखीहरूका लागि यी हुन् काठमाडौंका ५ उत्कृष्ट रेस्टुरेन्ट।',
    author: 'बिराज प्याकुरेल',
    published_at: '१८ फाल्गुन २०८२'
  },
  {
    id: 9,
    title: 'पोखरामा प्याराग्लाइडिङको नयाँ अनुभव',
    image: thumbnail3,
    excerpt: 'फेवा तालको सुन्दर दृश्य कैद गर्दै आकाशमा उड्नुको मज्जा बेग्लै छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '१७ फाल्गुन २०८२'
  },
  {
    id: 10,
    title: 'चितवन राष्ट्रिय निकुञ्जमा सफारी',
    image: thumbnailImage,
    excerpt: 'गैंडा र बाघ हेर्नका लागि चितवन अहिले उपयुक्त गन्तव्य बनेको छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '१६ फाल्गुन २०८२'
  },
  {
    id: 11,
    title: 'लुम्बिनी भ्रमणका लागि तयारी गर्दै हुनुहुन्छ?',
    image: thumbnail2,
    excerpt: 'शान्तिका अग्रदूत गौतम बुद्धको जन्मस्थल लुम्बिनी पुग्नुअघि यी कुराहरू थाहा पाउनुहोस्।',
    author: 'बिराज प्याकुरेल',
    published_at: '१५ फाल्गुन २०८२'
  },
  {
    id: 12,
    title: 'नेपालमा होमस्टे पर्यटनको बढ्दो आकर्षण',
    image: thumbnail3,
    excerpt: 'गाउँले जीवन र स्थानीय संस्कृतिको अनुभवका लागि होमस्टे प्रभावकारी माध्यम बनेको छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '१४ फाल्गुन २०८२'
  },
  {
    id: 13,
    title: 'एभरेष्ट बेस क्याम्प ट्रेक: एक जीवन परिवर्तनकारी अनुभव',
    image: thumbnailImage,
    excerpt: 'विश्वको सर्वोच्च शिखरको फेदसम्म पुग्ने सपना अब साकार पार्नुहोस्।',
    author: 'बिराज प्याकुरेल',
    published_at: '१३ फाल्गुन २०८२'
  },
  {
    id: 14,
    title: 'नेपाली मौलिक खानाको प्रवर्द्धनमा नयाँ प्रयास',
    image: thumbnail2,
    excerpt: 'परम्परागत स्वादलाई आधुनिक शैलीमा प्रस्तुत गर्दै युवा उद्यमीहरू।',
    author: 'बिराज प्याकुरेल',
    published_at: '१२ फाल्गुन २०८२'
  },
  {
    id: 15,
    title: 'मुस्ताङको मरुभूमिमा बुलबुले साहसिक यात्रा',
    image: thumbnail3,
    excerpt: 'अफ-रोडिङका शौखिनहरूका लागि मुस्ताङको यात्रा सधैं विशेष रहन्छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '११ फाल्गुन २०८२'
  },
  {
    id: 16,
    title: 'गण्डकी नदीमा र्‍याफ्टिङको रोमाञ्च',
    image: thumbnailImage,
    excerpt: 'गर्मी मौसमको सुरुवातसँगै त्रिशुली र भोटेकोशीमा जलयात्रा गर्नेहरूको भीड।',
    author: 'बिराज प्याकुरेल',
    published_at: '१० फाल्गुन २०८२'
  },
  {
    id: 17,
    title: 'नेपालमा साहसिक पर्यटनका नयाँ सम्भावना',
    image: thumbnail2,
    excerpt: 'बन्जी जम्पिङदेखि जिपलाइनसम्म, नेपाल अब साहसिक पर्यटनको हब बन्दैछ।',
    author: 'बिराज प्याकुरेल',
    published_at: '०९ फाल्गुन २०८२'
  },
  {
    id: 18,
    title: 'कला र संस्कृति: पाटन दरबार क्षेत्रको भ्रमण',
    image: thumbnail3,
    excerpt: 'नेपाली वास्तुकलाको अनुपम उदाहरण हेर्न पाटन एक भ्रमणयोग्य ठाउँ हो।',
    author: 'बिराज प्याकुरेल',
    published_at: '०८ फाल्गुन २०८२'
  },
  {
    id: 19,
    title: 'तिलिचो ताल: विश्वको सबैभन्दा उचाइमा रहेको ताल',
    image: thumbnailImage,
    excerpt: 'नीलो पानी र हिमालको काखमा रहेको तिलिचो पुग्न सजिलो छैन, तर सुन्दर छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '०७ फाल्गुन २०८२'
  },
  {
    id: 20,
    title: 'माउन्टेन फ्लाइट: सगरमाथालाई नजिकबाट नियाल्दा',
    image: thumbnail2,
    excerpt: 'काठमाडौंबाट हुने एक घण्टाको उडानले तपाईलाई हिमालको काखमा पुर्‍याउँछ।',
    author: 'बिराज प्याकुरेल',
    published_at: '०६ फाल्गुन २०८२'
  }
];

// Configuration from environment variables
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const fetchNewsData = async (): Promise<NewsDataResponse> => {
  if (USE_MOCK) {
    return new Promise<NewsDataResponse>((resolve) => {
      setTimeout(() => {
        resolve({
          hero: normalizeArticle(mockHeroArticle)!,
          featured: normalizeArticle(mockFeaturedArticle)!,
          articles: mockTargetArticles.map(normalizeArticle).filter((article): article is Article => article !== null)
        });
      }, 800);
    });
  }

  try {
    const response = await apiClient.get<NewsApiResponse>('/news');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch news');
    }

    const data = response.data;
    
    const heroArticle = normalizeArticle(data?.hero);
    const featuredArticle = normalizeArticle(data?.featured);
    const rawArticles = data?.articles || [];
    
    return {
      hero: heroArticle ? sanitizeArticle(heroArticle) : null,
      featured: featuredArticle ? sanitizeArticle(featuredArticle) : null,
      articles: rawArticles
        .map(normalizeArticle)
        .filter((article): article is Article => article !== null)
        .map(sanitizeArticle)
        .filter((article): article is Article => article !== null)
    };
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const fetchNewsDataWithRetry = async (maxRetries: number = 3, delayMs: number = 1000): Promise<NewsDataResponse> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchNewsData();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Failed to fetch news data');
};

// Fetch a specific article by ID
export const fetchArticleById = async (id: string | number): Promise<Article | null> => {
  if (USE_MOCK) {
    try {
      const mockData = await fetchNewsData();
      const allArticles = [mockData.hero, mockData.featured, ...mockData.articles].filter((a): a is Article => a !== null);
      const found = allArticles.find(a => String(a.id) === String(id));
      return found || null;
    } catch (e) {
      console.error('Mock article fetch failed:', e);
      return null;
    }
  }

  try {
    const response = await apiClient.get<RawArticle>(`/articles/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch article');
    }

    const data = response.data;
    const normalized = normalizeArticle(data);
    return normalized ? sanitizeArticle(normalized) : null;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    // Dynamic fallback when API single endpoint fails
    try {
      const fallbackData = await fetchNewsData();
      const allArticles = [fallbackData.hero, fallbackData.featured, ...fallbackData.articles].filter((a): a is Article => a !== null);
      const found = allArticles.find(a => String(a.id) === String(id));
      return found || null;
    } catch (fallbackError) {
      console.error('Fallback article fetch failed:', fallbackError);
      return null;
    }
  }
};

// Fetch articles by category
export const fetchArticlesByCategory = async (category: string, limit?: number): Promise<Article[]> => {
  if (USE_MOCK) {
    try {
      const mockData = await fetchNewsData();
      const allArticles = [mockData.hero, mockData.featured, ...mockData.articles].filter((a): a is Article => a !== null);
      let filtered = allArticles.filter(a => a.category === category || a.category?.toLowerCase() === category.toLowerCase());
      if (limit) filtered = filtered.slice(0, limit);
      return filtered;
    } catch (e) {
      console.error('Mock category fetch failed:', e);
      return [];
    }
  }

  try {
    const endpoint = limit
      ? `/articles?category=${encodeURIComponent(category)}&limit=${limit}`
      : `/articles?category=${encodeURIComponent(category)}`;

    interface ArticlesResponse {
      articles?: RawArticle[];
      data?: RawArticle[];
      [key: string]: unknown;
    }
    
    const response = await apiClient.get<RawArticle[] | ArticlesResponse>(endpoint);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch articles');
    }

    const data = response.data;
    const articles = Array.isArray(data) ? data :
                    (data as ArticlesResponse).articles ||
                    (data as ArticlesResponse).data ||
                    [];

    return articles
      .map(normalizeArticle)
      .filter((article: Article | null): article is Article => article !== null)
      .map(sanitizeArticle)
      .filter((article: Article | null): article is Article => article !== null);
  } catch (error) {
    console.error("Failed to fetch articles by category:", error);
    // Dynamic fallback
    try {
      const fallbackData = await fetchNewsData();
      const allArticles = [fallbackData.hero, fallbackData.featured, ...fallbackData.articles].filter((a): a is Article => a !== null);
      let filtered = allArticles.filter(a => a.category === category || a.category?.toLowerCase() === category.toLowerCase());
      if (limit) filtered = filtered.slice(0, limit);
      return filtered;
    } catch (fallbackError) {
      console.error('Fallback category fetch failed:', fallbackError);
      return [];
    }
  }
};

// Search articles
export const searchArticles = async (query: string, limit?: number): Promise<Article[]> => {
  if (USE_MOCK) {
    try {
      const mockData = await fetchNewsData();
      const allArticles = [mockData.hero, mockData.featured, ...mockData.articles].filter((a): a is Article => a !== null);
      const lowerQuery = query.toLowerCase();
      let filtered = allArticles.filter(a =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.excerpt.toLowerCase().includes(lowerQuery) ||
        (a.author && a.author.toLowerCase().includes(lowerQuery)) ||
        (a.category && a.category.toLowerCase().includes(lowerQuery))
      );
      if (limit) filtered = filtered.slice(0, limit);
      return filtered;
    } catch (e) {
      console.error('Mock search fetch failed:', e);
      return [];
    }
  }

  try {
    const endpoint = limit
      ? `/search?q=${encodeURIComponent(query)}&limit=${limit}`
      : `/search?q=${encodeURIComponent(query)}`;

    interface SearchResponse {
      articles?: RawArticle[];
      results?: RawArticle[];
      [key: string]: unknown;
    }
    
    const response = await apiClient.get<RawArticle[] | SearchResponse>(endpoint);

    if (!response.success) {
      throw new Error(response.error || 'No results found');
    }

    const data = response.data;
    const articles = Array.isArray(data) ? data :
                    (data as SearchResponse).articles ||
                    (data as SearchResponse).results ||
                    [];

    return articles
      .map(normalizeArticle)
      .filter((article: Article | null): article is Article => article !== null)
      .map(sanitizeArticle)
      .filter((article: Article | null): article is Article => article !== null);
  } catch (error) {
    console.error("Search failed:", error);
    // Dynamic fallback
    try {
      const fallbackData = await fetchNewsData();
      const allArticles = [fallbackData.hero, fallbackData.featured, ...fallbackData.articles].filter((a): a is Article => a !== null);
      const lowerQuery = query.toLowerCase();
      let filtered = allArticles.filter(a =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.excerpt.toLowerCase().includes(lowerQuery) ||
        (a.author && a.author.toLowerCase().includes(lowerQuery)) ||
        (a.category && a.category.toLowerCase().includes(lowerQuery))
      );
      if (limit) filtered = filtered.slice(0, limit);
      return filtered;
    } catch (fallbackError) {
      console.error('Fallback search fetch failed:', fallbackError);
      return [];
    }
  }
};

// Mock Site Configuration
const mockSiteConfig: SiteConfig = {
  siteName: 'यात्रीपाटी',
  logo: {
    text: 'यात्रीपाटी',
    image: undefined // Use SVG logo by default
  },
  navigation: [
    { label: 'होमपेज', path: '/', isCategory: false },
    { 
      label: 'प्रदेश', 
      path: '/category/pradesh', 
      isCategory: true, 
      hasDropdown: true,
      dropdownItems: [
        { label: 'प्रदेश १', path: '/category/pradesh-1' },
        { label: 'प्रदेश २', path: '/category/pradesh-2' },
        { label: 'प्रदेश ३', path: '/category/pradesh-3' },
        { label: 'प्रदेश ४', path: '/category/pradesh-4' },
        { label: 'प्रदेश ५', path: '/category/pradesh-5' },
        { label: 'प्रदेश ६', path: '/category/pradesh-6' },
        { label: 'प्रदेश ७', path: '/category/pradesh-7' },
      ]
    },
    { label: 'विचार', path: '/category/vichar', isCategory: true },
    { label: 'शिक्षा', path: '/category/shiksha', isCategory: true },
    { label: 'स्वास्थ्य', path: '/category/swasthya', isCategory: true },
    { label: 'खेलकुद', path: '/category/khel', isCategory: true },
    { label: 'अर्थतन्त्र', path: '/category/arthatantra', isCategory: true },
    { label: 'पर्यटन', path: '/category/tourism', isCategory: true },
    { label: 'प्रविधि', path: '/category/technology', isCategory: true },
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'Twitter', url: 'https://twitter.com' },
    { platform: 'Youtube', url: 'https://youtube.com' },
  ],
  footer: {
    aboutText: 'प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स। यात्रीपाटी नेपालको एक अग्रणी न्युज पोर्टल हो जसले सत्य, तथ्य र निष्पक्ष समाचार सम्प्रेषण गर्दछ।',
    copyright: `© ${new Date().getFullYear()} Yatri Pati. All rights reserved.`,
    columns: [
      {
        title: 'स्थान',
        links: [
          { label: 'समाज', path: '/category/samaj' },
          { label: 'विचार/कलम', path: '/category/vichar' },
          { label: 'साहित्य', path: '/category/sahitya' },
          { label: 'अन्तरवार्ता', path: '/category/interview' },
          { label: 'खेलकुद', path: '/category/khel' },
        ]
      },
      {
        title: 'महत्त्वपूर्ण',
        links: [
          { label: 'लोकसेवा आयोग', path: 'https://psc.gov.np', isExternal: true },
          { label: 'राष्ट्रिय योजना आयोग', path: 'https://npc.gov.np', isExternal: true },
          { label: 'सञ्चार तथा सूचना प्रविधि', path: 'https://moic.gov.np', isExternal: true },
          { label: 'गृह मन्त्रालय', path: 'https://moha.gov.np', isExternal: true },
        ]
      },
      {
        title: 'यात्रीपाटी',
        links: [
          { label: 'हाम्रो टिम', path: '/about/team' },
          { label: 'प्रयोगका सर्त', path: '/terms' },
          { label: 'विज्ञापन', path: '/ads' },
          { label: 'प्राइभेसी पोलिसी', path: '/privacy' },
          { label: 'सम्पर्क', path: '/contact' },
        ]
      }
    ]
  },
  sectionTitles: {
    latest: 'ताजा समाचार',
    hospitality: 'हस्पिटालिटि',
    hotels: 'होटल र रिसोर्ट',
    destination: 'गन्तव्य',
    trending: 'विशेष सिफारिस',
    packages: 'प्याकेज समाचार'
  },
  tickerNews: [
    'प्रधानमन्त्री देउवासँग अध्यक्ष लीको शिष्टाचार भेटवार्ता',
    'नेपालमा पर्यटन उद्योगको पुनरुत्थान: नयाँ योजनाहरू सार्वजनिक',
    'खेलकुदमा नेपाली खेलाडीहरूको उत्कृष्ट प्रदर्शन',
    'विश्वभरका प्रमुख घटनाक्रमहरू एकै ठाउँमा'
  ]
};

export const fetchSiteConfig = async (): Promise<SiteConfig> => {
  if (USE_MOCK) {
    return new Promise<SiteConfig>((resolve) => {
      setTimeout(() => resolve(mockSiteConfig), 500);
    });
  }

  try {
    const response = await apiClient.get<SiteConfig>('/config');
    if (!response.success) throw new Error('Failed to fetch config');
    return response.data as SiteConfig;
  } catch (err) {
    console.warn("Config fetch failed, using mock fallback", err);
    return mockSiteConfig;
  }
};
