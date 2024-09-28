import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const specials = [
  { imageUrl: '/images/specials/special_1.png' },
  { imageUrl: '/images/specials/special_2.png' },
  { imageUrl: '/images/specials/special_3.png' },
  { imageUrl: '/images/specials/special_4.png' },
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
      navigation={{
        nextEl: '#services-next',
        prevEl: '#services-prev',
        enabled: true,
      }}
      loop
      className=''
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      {specials.map((specials, index) => (
        <SwiperSlide key={index}>
          <div className='flex items-center'>
            <Image
              src={specials.imageUrl}
              alt='Special'
              width={100}
              height={100}
              unoptimized
              quality={100}
              className='w-auto'
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpecialsSlider;
