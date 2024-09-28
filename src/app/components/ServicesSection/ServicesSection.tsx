'use client';
import Image from 'next/image';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ServicesSlider from './ServicesSlider/ServicesSlider';

// import ServicesSlider from './ServicesSlider/ServicesSlider';

const ServicesSection: React.FC = () => {
  return (
    <section
      id='services'
      className='relative w-full bg-mbDark border-t-[9px] border-mbYellow'
    >
      {/* Section Heading */}
      <div className='my-[2rem]'>
        <SectionHeading
          title='Our Services'
          subtitle='Tailored services for every space and vision'
        />
      </div>

      {/* Swiper Slider for Services */}
      <div className='w-full mt-[2rem] px-[2rem] pb-[4rem]'>
        <ServicesSlider />
        <div className='lg:absolute top-[2rem] right-[2rem] flex mt-[2rem] gap-[2rem]'>
          <Image
            src='/images/services/arrow_left.svg'
            alt='Left arrow'
            width={20}
            height={20}
            className='custom-prev w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
            id='services-prev'
          ></Image>
          <Image
            src='/images/services/arrow_right.svg'
            alt='Right arrow'
            width={20}
            height={20}
            className='custom-next w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
            id='services-next'
          ></Image>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
