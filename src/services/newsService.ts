import ppImage from '../assets/pp.jpg';
import heroImage from '../assets/hero.jpg';
import thumbnailImage from '../assets/thumbnail.jpg';

export interface Article {
  id: string | number;
  title: string;
  image: string;
  excerpt: string;
  author: string;
  date: string;
  category?: string;
  authorAvatar?: string;
}

export interface ApiResponse {
  hero: Article;
  featured: Article;
  articles: Article[];
}

// Normalization function to handle backend dataset variation
export function normalizeArticle(rawArticle: any): Article {
  return {
    id: rawArticle.id || rawArticle._id || Math.random(),
    title: rawArticle.title || rawArticle.headline || '',
    image: rawArticle.image || rawArticle.thumbnail || rawArticle.thumb || '',
    excerpt: rawArticle.excerpt || rawArticle.summary || '',
    author: rawArticle.author || rawArticle.writer || 'बिराज प्याकुरेल',
    date: rawArticle.date || rawArticle.published_at || new Date().toLocaleDateString('ne-NP'),
    category: rawArticle.category || 'समाचार',
    authorAvatar: rawArticle.authorAvatar || ppImage
  }
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
  excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
  author: 'बिराज प्याकुरेल',
  date: '२२ भदौ २०७९, बुधबार'
};

const mockTargetArticles = [
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
    image: thumbnailImage,
    excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    writer: 'बिराज प्याकुरेल',
    date: '२२ भदौ २०७९, बुधबार'
  },
  {
    id: 3,
    title: 'संग्राममा हजारौं हजारलाई जिनेलाई भन्दा आफ्नो मनलाई जित सक्नेलाई संग्राम विजयी भनिन्छ',
    image: thumbnailImage,
    summary: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२२ भदौ २०७९, बुधबार'
  },
  {
    id: 4,
    title: 'आत्मा भित्र अनन्त शक्তिको स्रोत छैन र हामीले यो पावर जाग्रत गर्न सक्छौं',
    image: thumbnailImage,
    excerpt: 'आपनो अन्दरको शक्तिलाई चिनेर सफलतार्थ अग्रसर हुनुहोस्।',
    author: 'बिराज प्याकुरेल',
    published_at: '२१ भदौ २०७९, मङ्गलबार'
  },
  {
    id: 5,
    title: 'तपाईंको भविष्य तपाईंको सोचद्वारा तय हुन्छ, सकारात्मक सोच ग्रहण गर्नुहोस्',
    image: thumbnailImage,
    summary: 'जीवनमा सफलताको मुख्य कुञ्जी सकारात्मक सोचमा निहित छ।',
    author: 'बिराज प्याकुरेल',
    published_at: '२० भदौ २०७९, सोमबार'
  }
];

// Mock data function with simulated network delay
export const fetchNewsData = async () => {
  // Simulate network delay
  return new Promise<ApiResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        hero: normalizeArticle(mockHeroArticle),
        featured: normalizeArticle(mockFeaturedArticle),
        articles: mockTargetArticles.map(normalizeArticle)
      });
    }, 800);
  });
};

// Retry logic for consistent API (mock data doesn't need retry, but keeping for future API integration)
export const fetchNewsDataWithRetry = async (maxRetries: number = 3, delayMs: number = 1000): Promise<ApiResponse> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchNewsData();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to fetch news after ${maxRetries} attempts: ${error}`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Failed to fetch news data');
};
