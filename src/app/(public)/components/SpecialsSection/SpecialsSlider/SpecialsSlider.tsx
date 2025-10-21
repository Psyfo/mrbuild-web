import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ISpecial } from '@/types/special';
import { ImageShimmer } from '@/components/ImageShimmer';

interface SpecialsSliderProps {
  specials: ISpecial[];
}

const SpecialsSlider: React.FC<SpecialsSliderProps> = ({ specials }) => {
  if (!specials || specials.length === 0) {
    return null;
  }

  // Enable loop only if we have enough slides
  // Loop requires at least slidesPerView * 2 slides to work properly
  const enableLoop = specials.length >= 3;

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: Math.min(2, specials.length),
        },
        1024: {
          slidesPerView: Math.min(3, specials.length),
        },
        1280: {
          slidesPerView: Math.min(3, specials.length),
        },
      }}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: '.specials-next',
        prevEl: '.specials-prev',
      }}
      loop={enableLoop}
      className=''
    >
      {specials.map((special, index) => (
        <SwiperSlide key={special._id || index}>
          <div className='flex justify-center items-center'>
            <ImageShimmer
              src={special.image.secureUrl}
              alt={special.title || 'Special'}
              width={special.image.width}
              height={special.image.height}
              unoptimized
              quality={100}
              className='mx-auto w-[100%] h-auto'
              shimmerClassName='rounded-lg'
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpecialsSlider;
