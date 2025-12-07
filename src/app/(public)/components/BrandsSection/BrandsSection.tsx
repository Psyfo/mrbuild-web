'use client';
import BrandMarquee from './BrandMarquee/BrandMarquee';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const BrandsSection: React.FC = () => {
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

  const marqueeVariants = {
    hidden: { opacity: 0, y: 0 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }, // Fade in after heading
    },
  };

  return (
    <section
      ref={sectionRef}
      id='brands'
      className='bg-white w-full border-t-[9px] border-mbYellow'
    >
      {/* Section Heading */}
      <motion.div
        variants={headingVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='py-[4rem]'
      >
        <SectionHeading title='Brands' color='black' />
      </motion.div>

      {/* Brand Marquee */}
      <motion.div
        variants={marqueeVariants}
        initial='hidden'
        animate={isVisible ? 'visible' : 'hidden'}
        className='pb-[4rem]'
      >
        <BrandMarquee />
      </motion.div>
    </section>
  );
};

export default BrandsSection;
