'use client';
import BranchMap from './BranchMap/BranchMap';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const BranchLocator: React.FC = () => {
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
      { threshold: 0.1 } // Adjust this value as needed
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

  const infoVariants = {
    hidden: { opacity: 0, y: 20 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }, // Fade in after heading
    },
  };

  return (
    <section ref={sectionRef} id='branch-locator' className='bg-mbDark'>
      {/* Section Heading */}
      <motion.div
        variants={headingVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='flex flex-col items-center py-[4rem]'
      >
        <SectionHeading
          title='Branch Locator'
          subtitle='Find your nearest Mr. Build branch easily with our branch locator. We have conveniently located stores across South Africa. Locate your nearest branch today and let us assist you with all your construction needs.'
        />
        <motion.div
          variants={infoVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
          className='round border-[3px] border-mbYellow rounded-lg mt-[1rem] mx-[0] px-[1rem] lg:px-[4rem] py-[1rem] font-dinot text-[1rem] lg:text-[1.9rem] text-white tracking-[0.04rem]'
        >
          <div className='mb-[1rem] lg:mb-[2rem]'>Our operating hours are:</div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Mon - Fri</span>
            <span>07:30 - 13:00, 14:00 - 16:30</span>
          </div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Sat</span>
            <span>07:30 - 12:30</span>
          </div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Sun</span>
            <span>Closed</span>
          </div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Public Holidays</span>
            <span>Hours might differ</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Branch Locator  */}
      <BranchMap />
    </section>
  );
};

export default BranchLocator;
