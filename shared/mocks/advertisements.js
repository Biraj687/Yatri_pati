/**
 * Mock Advertisement Data
 * Used for development and testing
 */
export const mockAdvertisements = [
    {
        id: '1',
        title: 'Explore Nepal with Us - 20% Off',
        description: 'Discover the beauty of Nepal. Book your adventure today!',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="100"%3E%3Crect fill="%236366f1" width="800" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EExplore Nepal - 20%25 Off%3C/text%3E%3C/svg%3E',
        linkUrl: 'https://example.com/tour-nepal',
        position: 'hero',
        placement: 1,
        isActive: true,
        impressions: 1234,
        clicks: 45,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-25T14:30:00Z',
        status: 'active'
    },
    {
        id: '2',
        title: 'Hotel Booking Promo',
        description: 'Save up to 40% on luxury hotels across Nepal',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="100"%3E%3Crect fill="%2310b981" width="800" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EHotel Booking - 40%25 Sale%3C/text%3E%3C/svg%3E',
        linkUrl: 'https://example.com/hotels',
        position: 'fullwidth',
        placement: 2,
        isActive: true,
        impressions: 2100,
        clicks: 87,
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-03-24T16:45:00Z',
        status: 'active'
    },
    {
        id: '3',
        title: 'Travel Insurance Coverage',
        description: 'Comprehensive travel insurance for your peace of mind',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f59e0b" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ETravel Insurance%3C/text%3E%3C/svg%3E',
        linkUrl: 'https://example.com/insurance',
        position: 'sidebar',
        placement: 1,
        isActive: true,
        impressions: 892,
        clicks: 32,
        createdAt: '2024-02-10T11:30:00Z',
        updatedAt: '2024-03-20T12:00:00Z',
        status: 'active'
    },
    {
        id: '4',
        title: 'Local Restaurant Guide',
        description: 'Discover authentic Nepali cuisine',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ec4899" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ELocal Cuisine%3C/text%3E%3C/svg%3E',
        linkUrl: 'https://example.com/restaurants',
        position: 'inline',
        placement: 2,
        isActive: true,
        impressions: 654,
        clicks: 28,
        createdAt: '2024-02-20T14:15:00Z',
        updatedAt: '2024-03-19T10:00:00Z',
        status: 'active'
    },
    {
        id: '5',
        title: 'Photography Tour - Limited Seats',
        description: 'Professional photography tour with expert guides',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="100"%3E%3Crect fill="%238b5cf6" width="800" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EPhotography Tour - Limited Seats%3C/text%3E%3C/svg%3E',
        linkUrl: 'https://example.com/photography-tour',
        position: 'hero',
        placement: 3,
        isActive: false,
        impressions: 456,
        clicks: 12,
        createdAt: '2024-03-01T08:00:00Z',
        updatedAt: '2024-03-18T16:30:00Z',
        status: 'expired'
    }
];
export const mockAnalyticsData = {
    totalImpressions: 5336,
    totalClicks: 204,
    ctr: 3.82,
    topAds: [
        {
            id: '2',
            title: 'Hotel Booking Promo',
            clicks: 87,
            impressions: 2100
        },
        {
            id: '1',
            title: 'Explore Nepal with Us - 20% Off',
            clicks: 45,
            impressions: 1234
        },
        {
            id: '3',
            title: 'Travel Insurance Coverage',
            clicks: 32,
            impressions: 892
        },
        {
            id: '4',
            title: 'Local Restaurant Guide',
            clicks: 28,
            impressions: 654
        },
        {
            id: '5',
            title: 'Photography Tour - Limited Seats',
            clicks: 12,
            impressions: 456
        }
    ]
};
