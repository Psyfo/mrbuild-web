'use client';
import Image from 'next/image';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import SpecialsSlider from './SpecialsSlider/SpecialsSlider';

const SpecialsSection: React.FC = () => {
  return (
    <section
      id='specials'
      className='flex flex-col w-full py-[4rem] bg-mbDark border-t-[9px] border-mbYellow'
    >
      {/* Section Heading */}
      <SectionHeading
        title='Exclusive In-Store Specials for the Month'
        subtitle='Discover unbeatable deals on top-quality tools, hardware, and building
          supplies. Visit us in-store this month for limited-time offers you
          won’t want to miss!'
      />

      {/* Swiper Slider for Specials */}
      <div className='relative w-full my-[2rem] px-[2rem]'>
        <SpecialsSlider />
        {/* Carousel buttons */}
        <Image
          src='/images/services/arrow_left.svg'
          alt='Left arrow'
          width={20}
          height={20}
          className='hidden lg:block absolute top-1/2 left-12 z-20 transform -translate-y-1/2 custom-prev w-[50px]  h-[50px] lg:h-[90px]'
          id='services-prev'
        ></Image>
        <Image
          src='/images/services/arrow_right.svg'
          alt='Right arrow'
          width={20}
          height={20}
          className='hidden lg:block absolute top-1/2 right-12 z-20 transform -translate-y-1/2 custom-next w-[50px] h-[50px] lg:h-[90px]'
          id='services-next'
        ></Image>
      </div>

      {/* Follow links */}
      <div className='flex flex-col gap-[1.5rem] items-center mt-[6rem]'>
        <span className='font-dinot text-white text-center text-[1rem] lg:text-[1.6rem] tracking-[0.04rem] mb-[2rem]'>
          Follow us to stay up to date with our specials
        </span>
        <div className='flex gap-[2rem]'>
          <a
            href='https://www.facebook.com/profile.php?id=61551736583171'
            target='_blank'
          >
            <div className='flex items-center gap-[1rem]'>
              <Image
                src='/images/specials/icon_facebook.svg'
                alt='Mr Build Facebook'
                width={42}
                height={42}
                className='lg:w-[62px] lg:h-[62px]'
              />
              <div className='font-dino text-[1rem] text-white'>Mr Build</div>
            </div>
          </a>
          <a href='https://www.instagram.com/mrbuild_sa/?hl=en' target='_blank'>
            <div className='flex items-center gap-[1rem]'>
              <Image
                src='/images/specials/icon_instagram.svg'
                alt='Mr Build Instagram'
                width={42}
                height={42}
                className='lg:w-[62px] lg:h-[62px]'
              />
              <div className='font-dino text-[1rem] text-white'>Mr Build</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialsSection;
