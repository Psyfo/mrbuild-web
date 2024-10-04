import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const specials = [
  { imageUrl: '/images/specials/special_1.png' },
  { imageUrl: '/images/specials/special_2.png' },
  { imageUrl: '/images/specials/special_3.png' },
  { imageUrl: '/images/specials/special_4.png' },
  { imageUrl: '/images/specials/special_5.png' },
  { imageUrl: '/images/specials/special_6.png' },
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
          <div className='flex items-center justify-center]'>
            <Image
              src={specials.imageUrl}
              alt='Special'
              width={100}
              height={100}
              unoptimized
              quality={100}
              className='w-[100%] h-auto mx-auto'
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpecialsSlider;
