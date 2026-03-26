/**
 * Mock article data
 * Contains placeholder data without hardcoded asset dependencies
 */

import type { Article } from '../types';

// Placeholder image URLs (can be replaced with actual URLs or data URIs)
const PLACEHOLDER_IMAGES = {
  hero: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM2NmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SEVSTyBJTUFHRTwvdGV4dD48L3N2Zz4=',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+VEhVTUJOQUlMPC90ZXh0Pjwvc3ZnPg==',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwNzNmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkE8L3RleHQ+PC9zdmc+'
};

export const mockArticles: Article[] = [
  {
    id: 'hero-1',
    title: 'जहाँ जहाँ जान्छौ तिमि, म पाइला बनि पछ्याई रहन्छु',
    image: PLACEHOLDER_IMAGES.hero,
    excerpt: 'एक अनौठो कथा जो तपाईंको हृदय छुने छ र जीवनको अर्थ सिखाउँछ।',
    author: 'बिराज प्याकुरेल',
    date: '२२ फाल्गुन २०८२, बुधबार — २ दिन पहिले',
    category: 'पाइला',
    authorAvatar: PLACEHOLDER_IMAGES.avatar,
    readTime: '5 min',
    views: 1250,
    content: 'यो लेखको पूर्ण सामग्री यहाँ हुनेछ। यो मात्र एउटा नमुना मोक डाटा हो। वास्तविक एप्लिकेसनमा यो सामग्री ब्याकएन्डबाट आउनेछ।'
  },
  {
    id: 'featured-1',
    title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराखु र केही पनि नमाग्रु नै स्वतन्त्रता हो।',
    image: PLACEHOLDER_IMAGES.thumbnail,
    excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलियिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    date: '२२ भदौ २०७९, बुधबार',
    category: 'विचार',
    authorAvatar: PLACEHOLDER_IMAGES.avatar,
    readTime: '3 min',
    views: 890,
    content: 'स्वतन्त्रताको अर्थ के हो? यस लेखमा हामी स्वतन्त्रताको वास्तविक अर्थ र यसलाई कसरी प्राप्त गर्न सकिन्छ भन्ने बारेमा छलफल गर्नेछौं।'
  },
  {
    id: 'article-3',
    title: 'संग्राममा हजारौं हजारलाई जिनेलाई भन्दा आफ्नो मनलाई जित सक्नेलाई संग्राम विजयी भनिन्छ',
    image: PLACEHOLDER_IMAGES.thumbnail,
    excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    date: '२२ भदौ २०७९, बुधबार',
    category: 'साहित्य',
    authorAvatar: PLACEHOLDER_IMAGES.avatar,
    readTime: '4 min',
    views: 750,
    content: 'आन्तरिक संग्राम बाह्य संग्रामभन्दा कठिन हुन्छ। यस लेखमा हामी आफ्नो मनलाई कसरी जित्ने भन्ने बारेमा जानकारी दिनेछौं।'
  },
  {
    id: 'article-4',
    title: 'आत्मा भित्र अनन्त शक्तिको स्रोत छैन र हामीले यो पावर जाग्रत गर्न सक्छौं',
    image: PLACEHOLDER_IMAGES.thumbnail,
    excerpt: 'आपनो अन्दरको शक्तिलाई चिनेर सफलतार्थ अग्रसर हुनुहोस्।',
    author: 'बिराज प्याकुरेल',
    date: '२१ भदौ २०७९, मङ्गलबार',
    category: 'विचार',
    authorAvatar: PLACEHOLDER_IMAGES.avatar,
    readTime: '6 min',
    views: 620,
    content: 'प्रत्येक मानिसको भित्र अनन्त शक्तिको स्रोत छ। यसलाई जाग्रत गर्ने तरिका र यसको प्रयोग कसरी गर्ने भन्ने बारेमा यो लेखले बताउँछ।'
  },
  {
    id: 'article-5',
    title: 'प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ',
    image: PLACEHOLDER_IMAGES.thumbnail,
    excerpt: 'यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहन्छु ।',
    author: 'बिराज प्याकुरेल',
    date: '२२ भदौ २०७९, बुधबार',
    category: 'समाज',
    authorAvatar: PLACEHOLDER_IMAGES.avatar,
    readTime: '7 min',
    views: 540,
    content: 'मानवताको आधारभूत सिद्धान्त: अरूलाई आफू जस्तै सम्झनु। यसले समाजमा कसरी सद्भाव र सम्मान बढाउँछ भन्ने बारेमा यो लेख।'
  }
];

export const mockCategories = [
  'समाचार',
  'विचार',
  'पाइला',
  'साहित्य',
  'खेलकुद',
  'समाज',
  'विज्ञान',
  'प्रविधि'
];