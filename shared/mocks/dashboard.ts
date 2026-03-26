/**
 * Mock dashboard data
 */

import type { DashboardStats, FileItem } from '../types';
import { mockArticles } from './articles';

// Placeholder image URLs
const PLACEHOLDER_IMAGES = {
  file: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5GSUxFPC90ZXh0Pjwvc3ZnPg=='
};

export const mockDashboardStats: DashboardStats = {
  totalArticles: 42,
  publishedArticles: 28,
  draftArticles: 14,
  totalFiles: 156,
  totalViews: 12500,
  recentArticles: mockArticles.slice(0, 3).map(article => ({
    ...article,
    status: Math.random() > 0.5 ? 'published' : 'draft' as const
  })),
  popularCategories: [
    { name: 'समाचार', count: 15 },
    { name: 'विचार', count: 12 },
    { name: 'पाइला', count: 8 },
    { name: 'साहित्य', count: 5 },
    { name: 'खेलकुद', count: 2 }
  ]
};

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'hero-image.jpg',
    size: 2457600,
    type: 'image/jpeg',
    url: PLACEHOLDER_IMAGES.file,
    uploadedAt: '2024-03-25T10:30:00Z',
    uploadedBy: 'Admin'
  },
  {
    id: '2',
    name: 'document.pdf',
    size: 512000,
    type: 'application/pdf',
    url: PLACEHOLDER_IMAGES.file,
    uploadedAt: '2024-03-24T14:20:00Z',
    uploadedBy: 'Editor'
  },
  {
    id: '3',
    name: 'presentation.pptx',
    size: 1024000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: PLACEHOLDER_IMAGES.file,
    uploadedAt: '2024-03-23T09:15:00Z',
    uploadedBy: 'Admin'
  },
  {
    id: '4',
    name: 'spreadsheet.xlsx',
    size: 768000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: PLACEHOLDER_IMAGES.file,
    uploadedAt: '2024-03-22T16:45:00Z',
    uploadedBy: 'Viewer'
  },
  {
    id: '5',
    name: 'archive.zip',
    size: 5120000,
    type: 'application/zip',
    url: PLACEHOLDER_IMAGES.file,
    uploadedAt: '2024-03-21T11:20:00Z',
    uploadedBy: 'Admin'
  }
];

export const mockSiteConfig = {
  siteName: 'यात्रीपाटी',
  logo: {
    text: 'यात्रीपाटी',
    image: PLACEHOLDER_IMAGES.file
  },
  navigation: [
    { label: 'गृहपृष्ठ', path: '/', isCategory: false },
    { label: 'समाचार', path: '/category/news', isCategory: true },
    { label: 'विचार', path: '/category/opinion', isCategory: true },
    { label: 'पाइला', path: '/category/travel', isCategory: true },
    { label: 'साहित्य', path: '/category/literature', isCategory: true },
    { label: 'खेलकुद', path: '/category/sports', isCategory: true }
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com/yatripati' },
    { platform: 'Twitter', url: 'https://twitter.com/yatripati' },
    { platform: 'YouTube', url: 'https://youtube.com/yatripati' },
    { platform: 'Instagram', url: 'https://instagram.com/yatripati' }
  ],
  footer: {
    aboutText: 'यात्रीपाटी - नेपाली भाषामा समाचार, विचार, साहित्य र जीवनशैलीको अग्रणी मञ्च।',
    copyright: '© २०२४ यात्रीपाटी। सर्वाधिकार सुरक्षित।',
    columns: [
      {
        title: 'शीर्ष श्रेणीहरू',
        links: [
          { label: 'समाचार', path: '/category/news' },
          { label: 'विचार', path: '/category/opinion' },
          { label: 'पाइला', path: '/category/travel' },
          { label: 'साहित्य', path: '/category/literature' }
        ]
      },
      {
        title: 'कम्पनी',
        links: [
          { label: 'हाम्रो बारेमा', path: '/about' },
          { label: 'सम्पर्क', path: '/contact' },
          { label: 'गोपनीयता नीति', path: '/privacy' },
          { label: 'सेवाका सर्तहरू', path: '/terms' }
        ]
      },
      {
        title: 'सहयोग',
        links: [
          { label: 'लेखक बन्नुहोस्', path: '/become-author' },
          { label: 'विज्ञापन', path: '/advertise' },
          { label: 'सदस्यता', path: '/subscribe' },
          { label: 'सहयोग गर्नुहोस्', path: '/donate' }
        ]
      }
    ]
  },
  sectionTitles: {
    hero: 'मुख्य समाचार',
    featured: 'विशेष लेख',
    news: 'ताजा समाचार',
    opinion: 'विचार',
    travel: 'पाइला',
    literature: 'साहित्य',
    sports: 'खेलकुद'
  }
};