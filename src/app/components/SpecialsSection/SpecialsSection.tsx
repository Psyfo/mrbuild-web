'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import SpecialsSlider from './SpecialsSlider/SpecialsSlider';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const SpecialsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the section is visible
        }
      },
      { threshold: 0.6 } // Adjust this value as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Variants for animations
  const headingVariants = {
    hidden: { opacity: 0, y: -20 }, // Start above
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  const sliderVariants = {
    hidden: { opacity: 0, y: 20 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }, // Fade in after heading
    },
  };

  const followLinksVariants = {
    hidden: { opacity: 0, y: 20 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 1 }, // Fade in after slider
    },
  };

  return (
    <section
      ref={sectionRef}
      id='specials'
      className='flex flex-col w-full py-[4rem] bg-mbDark border-t-[9px] border-mbYellow'
    >
      {/* Section Heading */}
      <motion.div
        variants={headingVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
      >
        <SectionHeading
          title='Exclusive In-Store Specials for the Month'
          subtitle='Discover unbeatable deals on top-quality tools, hardware, and building
          supplies. Visit us in-store this month for limited-time offers you
          won’t want to miss!'
        />
      </motion.div>

      {/* Swiper Slider for Specials */}
      <motion.div
        variants={sliderVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='relative w-full my-[2rem] px-[2rem]'
      >
        <SpecialsSlider />
        {/* Carousel buttons */}
        <Image
          src='/images/services/arrow_left.svg'
          alt='Left arrow'
          width={20}
          height={20}
          className='hidden lg:block absolute top-1/2 left-12 z-20 transform -translate-y-1/2 custom-prev w-[50px] h-[50px] lg:h-[90px]'
          id='services-prev'
        />
        <Image
          src='/images/services/arrow_right.svg'
          alt='Right arrow'
          width={20}
          height={20}
          className='hidden lg:block absolute top-1/2 right-12 z-20 transform -translate-y-1/2 custom-next w-[50px] h-[50px] lg:h-[90px]'
          id='services-next'
        />
      </motion.div>

      {/* Follow links */}
      <motion.div
        variants={followLinksVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='flex flex-col gap-[1.5rem] items-center mt-[6rem]'
      >
        <span className='font-dinot text-white text-center text-[1rem] lg:text-[1.6rem] tracking-[0.04rem] mb-[2rem]'>
          Follow us to stay up to date with our specials
        </span>
        <div className='flex gap-[2rem]'>
          <a
            href='https://www.facebook.com/profile.php?id=61551736583171'
            target='_blank'
            rel='noopener noreferrer'
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
          <a
            href='https://www.instagram.com/mrbuild_sa/?hl=en'
            target='_blank'
            rel='noopener noreferrer'
          >
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
      </motion.div>
    </section>
  );
};

export default SpecialsSection;
