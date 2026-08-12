/**
 * Centralized string constants for the Yatri Pati application
 * Supports future i18n/translation implementation
 */

export const UI_STRINGS = {
  // Navigation
  SEARCH_PLACEHOLDER: 'समाचार खोज्नुहोस्...',
  SEARCH_HELP: 'शीर्षक, लेखक, वा श्रेणी अनुसार खोज्नुहोस्। उदाहरण: "राजनीति", "खेलकुद", "बिराज प्याकुरेल"',
  CLEAR_SEARCH: 'खोज खाली गर्नुहोस्',

  // Loading & Status
  LOADING_NEWS: 'समाचार लोड हुँदैछ...',
  SEARCHING: 'खोजिँदै...',
  LOADING: 'लोड हुँदैछ...',
  READING_TIME: 'पढ्नु को समय',
  SHORT_READ: 'कम पढ्नु',
  ONE_MINUTE_READ: '१ मिनेट पढ्नु',
  MINUTE_READ: 'मिनेट पढ्नु',

  // Search
  SEARCH_RESULTS_FOUND: 'परिणाम भेटियो',
  SEARCH_NO_RESULTS: 'को लागि कुनै परिणाम भेटिएन।',
  
  // Errors
  SEARCH_ERROR: 'खोज गर्दा त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।',
  ERROR_LOADING: 'डाटा लोड गर्दा त्रुटि भयो।',
  SOMETHING_WENT_WRONG: 'केही गलत भयो। कृपया पुनः प्रयास गर्नुहोस्।',

  // Empty States
  NO_ARTICLES: 'कुनै समाचार भेटिएन।',
  NO_ARTICLES_IN_CATEGORY: 'यस श्रेणीमा कुनै समाचार छैन।',

  // Common Actions
  READ_MORE: 'थप पढ्नुहोस्',
  BACK: 'पछाडी',
  SHARE: 'साझा गर्नुहोस्',

  // Section Titles (defaults)
  LATEST_NEWS: 'नवीनतम समाचार',
  FEATURED: 'चिनारिएको',
  PACKAGES: 'प्याकेज समाचार',
  DESTINATION: 'गन्तव्य',
  HOSPITALITY: 'हस्पिटालिटि',
  HOTELS: 'होटल र रिसोर्ट',
  SPECIAL_RECOMMENDATIONS: 'विशेष सिफारिस',

  // Default Author
  DEFAULT_AUTHOR: 'बिराज प्याकुरेल',

  // Categories (common)
  CATEGORY_NEWS: 'समाचार',
  CATEGORY_TRAVEL: 'पाइला',
  CATEGORY_HOSPITALITY: 'होटल',

  // Date/Time
  JUST_NOW: 'भर्खरै',
  HOURS_AGO: (hours: number) => `${hours} घण्टा अघि`,
  DAYS_AGO: (days: number) => `${days} दिन अघि`,
} as const;

export const ERROR_MESSAGES = {
  INVALID_URL: 'अमान्य URL',
  NETWORK_ERROR: 'नेटवर्क त्रुटि',
  INVALID_EMAIL: 'अमान्य ईमेल पते',
  RATE_LIMIT: 'अनुरोध को संख्या अधिक छ। कृपया देर गरेर प्रयास गर्नुहोस्।',
  SERVER_ERROR: 'सर्भर त्रुटि। कृपया पछी प्रयास गर्नुहोस्।',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'यो क्षेत्र आवश्यक छ।',
  MIN_LENGTH: (length: number) => `न्यूनतम ${length} वर्ण आवश्यक छ।`,
  MAX_LENGTH: (length: number) => `अधिकतम ${length} वर्ण अनुमत छ।`,
} as const;
