import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  fallbackSrc?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  fallbackSrc = 'https://via.placeholder.com/400x300?text=Image+Not+Available',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before image enters viewport
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate srcSet for responsive images if we have width/height
  const generateSrcSet = () => {
    if (!width || !height) return undefined;
    
    const baseUrl = src.split('?')[0];
    const multipliers = [1, 2, 3]; // 1x, 2x, 3x for retina displays
    
    return multipliers
      .map(multiplier => {
        const w = Math.round(width * multiplier);
        const h = Math.round(height * multiplier);
        return `${baseUrl}?w=${w}&h=${h}&fit=crop ${multiplier}x`;
      })
      .join(', ');
  };

  const imageSrc = hasError ? fallbackSrc : src;
  const shouldLoad = isInView || priority;
  const loading = lazy && !priority ? 'lazy' : 'eager';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={shouldLoad ? imageSrc : ''}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        srcSet={generateSrcSet()}
        sizes={sizes}
      />

      {/* Accessibility: Hidden loading indicator */}
      {!isLoaded && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading image: {alt}
        </div>
      )}
    </div>
  );
}

// Hook for image preloading
export function useImagePreload(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    
    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setIsLoaded(true); // Consider loaded even on error
    
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return isLoaded;
}