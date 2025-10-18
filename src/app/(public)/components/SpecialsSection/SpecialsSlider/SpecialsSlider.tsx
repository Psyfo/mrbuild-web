import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const specials = [
  { imageUrl: '/images/specials/1.png' },
  { imageUrl: '/images/specials/2.png' },
  { imageUrl: '/images/specials/3.png' },
  { imageUrl: '/images/specials/4.png' },
  { imageUrl: '/images/specials/5.png' },
  { imageUrl: '/images/specials/6.png' },
  { imageUrl: '/images/specials/7.png' },
  { imageUrl: '/images/specials/8.png' },
  { imageUrl: '/images/specials/9.png' },
  { imageUrl: '/images/specials/10.png' },
];

const SpecialsSlider: React.FC = () => {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 3,
        },
      }}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: '.specials-next',
        prevEl: '.specials-prev',
      }}
      loop
      className=''
    >
      {specials.map((specials, index) => (
        <SwiperSlide key={index}>
          <div className='flex justify-center] items-center'>
            <Image
              src={specials.imageUrl}
              alt='Special'
              width={100}
              height={100}
              unoptimized
              quality={100}
              className='mx-auto w-[100%] h-auto'
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpecialsSlider;
