'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageShimmerProps extends ImageProps {
  shimmerClassName?: string;
  alt: string; // Make alt explicitly required
}

export const ImageShimmer: React.FC<ImageShimmerProps> = ({
  shimmerClassName = '',
  className = '',
  onLoad,
  alt,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className='relative'>
      {/* Shimmer overlay - shown while loading */}
      {isLoading && (
        <div
          className={`absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${shimmerClassName}`}
        />
      )}

      {/* Actual image */}
      <Image
        {...props}
        alt={alt}
        className={`${className} ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-500`}
        onLoad={handleLoad}
      />
    </div>
  );
};
