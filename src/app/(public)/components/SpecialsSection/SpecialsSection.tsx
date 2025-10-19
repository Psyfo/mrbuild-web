'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { ISpecial } from '@/types/special';

import SpecialsSlider from './SpecialsSlider/SpecialsSlider';

/* eslint-disable react-hooks/exhaustive-deps */

const SpecialsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [specials, setSpecials] = useState<ISpecial[]>([]);
  const [hasActiveSpecials, setHasActiveSpecials] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch specials from API
  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        const response = await fetch('/api/specials');
        if (response.ok) {
          const data = await response.json();
          setSpecials(data.specials || []);
          setHasActiveSpecials(data.hasActiveSpecials || false);
        }
      } catch (error) {
        console.error('Error fetching specials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  // Set up IntersectionObserver only after data is loaded and section exists
  useEffect(() => {
    // Don't set up observer if still loading or no specials
    if (loading || !hasActiveSpecials || specials.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the section is visible
        }
      },
      { threshold: 0.3 } // Adjust this value as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [loading, hasActiveSpecials, specials.length]); // Re-run when data changes

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

  // Don't render section if loading or no active specials
  if (loading) {
    return null; // or a skeleton loader
  }

  if (!hasActiveSpecials || specials.length === 0) {
    return null; // Hide section when no active specials
  }

  return (
    <section
      ref={sectionRef}
      id='specials'
      className='flex flex-col bg-mbDark py-[4rem] border-mbYellow border-t-[9px] w-full'
    >
      {/* Section Heading */}
      <motion.div
        variants={headingVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
      >
        <SectionHeading
          title='Exclusive In-Store Specials for the Month'
          subtitle="Discover unbeatable deals on top-quality tools, hardware, and building
          supplies. Visit us in-store this month for limited-time offers you
          won't want to miss!"
        />
      </motion.div>

      {/* Swiper Slider for Specials */}
      <motion.div
        variants={sliderVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='relative my-[2rem] px-[2rem] lg:px-[5rem] w-full'
      >
        <SpecialsSlider specials={specials} />
        {/* Carousel buttons */}
        <div className='top-[50%] right-[2rem] lg:right-0 lg:absolute flex lg:justify-between gap-[2rem] mt-[2rem] lg:mt-0 lg:px-[1rem] w-auto lg:w-screen translate-y-[-50%] transform'>
          <Image
            src='/images/services/arrow_left.svg'
            alt='Left arrow'
            width={20}
            height={20}
            className='w-[50px] lg:w-[50px] h-[50px] lg:h-[50px] specials-prev'
            id='specials-prev'
          />
          <Image
            src='/images/services/arrow_right.svg'
            alt='Right arrow'
            width={20}
            height={20}
            className='w-[50px] lg:w-[50px] h-[50px] lg:h-[50px] specials-next'
            id='specials-next'
          />
        </div>
      </motion.div>

      {/* Follow links */}
      <motion.div
        variants={followLinksVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='flex flex-col items-center gap-[1.5rem] mt-[6rem]'
      >
        <span className='mb-[2rem] font-dinot text-[1rem] text-white lg:text-[1.6rem] text-center tracking-[0.04rem]'>
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
