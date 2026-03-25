import { useState } from 'react';

interface AdBannerProps {
  id?: string;
  imageUrl?: string;
  adText?: string;
  linkUrl?: string;
  height?: string;
  backgroundColor?: string;
}

export function AdBanner({
  id = 'ad-banner-default',
  imageUrl,
  adText = 'Advertisement',
  linkUrl,
  height = '100px',
  backgroundColor = 'bg-gray-100 dark:bg-gray-800'
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const bannerContent = (
    <div
      id={id}
      className={`relative w-full flex items-center justify-center overflow-hidden ${backgroundColor} border-y border-gray-200 dark:border-gray-700 transition-colors duration-300`}
      style={{ minHeight: height }}
    >
      {/* Ad Content */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Advertisement"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-gray-400 dark:text-gray-500 text-sm font-medium">
            {adText}
          </div>
          <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      )}

      {/* Optional Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 hover:opacity-100 p-1"
        aria-label="Close advertisement"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
}
