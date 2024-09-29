'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ServicesSlider from './ServicesSlider/ServicesSlider';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const ServicesSection: React.FC = () => {
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

  // Variants for the fade-in animations
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
      transition: { duration: 1, delay: 0.5 }, // Delay to match the heading animation
    },
  };

  return (
    <section
      ref={sectionRef}
      id='services'
      className='relative w-full bg-mbDark border-t-[9px] border-mbYellow'
    >
      {/* Section Heading */}
      <motion.div
        variants={headingVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='my-[2rem]'
      >
        <SectionHeading
          title='Our Services'
          subtitle='Tailored services for every space and vision'
        />
        {/* LG Buttons */}
        <div className='hidden lg:absolute top-[0rem] right-[2rem] lg:flex z-40 mt-[2rem] gap-[2rem]'>
          <Image
            src='/images/services/arrow_left.svg'
            alt='Left arrow'
            width={20}
            height={20}
            className='services-prev w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
            id='services-prev'
          />
          <Image
            src='/images/services/arrow_right.svg'
            alt='Right arrow'
            width={20}
            height={20}
            className='services-next w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
            id='services-next'
          />
        </div>
      </motion.div>

      {/* Swiper Slider for Services */}
      <motion.div
        variants={sliderVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='w-full mt-[2rem] px-[2rem] pb-[4rem]'
      >
        <ServicesSlider />
      </motion.div>
    </section>
  );
};

export default ServicesSection;
