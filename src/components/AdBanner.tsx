import { useState } from 'react';

interface AdBannerProps {
  id?: string;
  imageUrl?: string;
  adText?: string;
  linkUrl?: string;
  height?: string;
  backgroundColor?: string;
  maxWidth?: string;
  center?: boolean;
  className?: string;
}

export function AdBanner({
  id = 'ad-banner-default',
  imageUrl,
  adText = 'Advertisement',
  linkUrl,
  height = '100px',
  backgroundColor = 'bg-gray-100 dark:bg-gray-800',
  maxWidth = 'max-w-[1440px]',
  center = true,
  className = ''
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const containerClasses = `relative w-full ${maxWidth} mx-auto flex items-center justify-center overflow-hidden ${backgroundColor} transition-colors duration-300 ${className}`;
  
  const bannerContent = (
    <div
      id={id}
      className={containerClasses}
      style={{ minHeight: height }}
    >
      {/* Inner container with max-width constraint */}
      <div className={`w-full ${center ? 'mx-auto' : ''} ${maxWidth} px-4 md:px-12 lg:px-20`}>
        {/* Ad Content */}
        {imageUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Advertisement"
              className="w-full h-full object-contain max-h-[80px] md:max-h-[90px]"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <div className="text-gray-400 dark:text-gray-500 text-sm font-medium">
              {adText}
            </div>
            <div className="w-48 h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Ad Space</span>
            </div>
          </div>
        )}

        {/* Optional Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 md:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 hover:opacity-100 p-1"
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
