'use client';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const data = [
  { tagline: 'Year Established', value: '1988' },
  { tagline: 'Approximate No. of Staff', value: '320' },
  { tagline: 'Number of Stores', value: '8' },
  { tagline: 'Number of Projects', value: '26' },
];

const NumbersSection: React.FC = () => {
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

  // Variants for the animations
  const headingVariants = {
    hidden: { opacity: 0, y: -20 }, // Start above
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  const boxVariants = {
    hidden: { opacity: 0, y: 20 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }, // Shorter transition for boxes
    },
  };

  return (
    <section
      ref={sectionRef}
      id='numbers'
      className='w-full lg:h-auto bg-black border-t-[9px] border-mbYellow'
    >
      <div className="flex flex-col w-full h-full lg:h-auto bg-[url('/images/about/mb_about_bg.png')] bg-cover bg-center bg-opacity-20 parallax">
        {/* Section Heading */}
        <motion.div
          variants={headingVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
          className='my-[2rem] lg:mt-[8.5rem] lg:mb-[4rem]'
        >
          <SectionHeading title='Our Numbers' />
        </motion.div>

        {/* Numbers Boxes */}
        <div className='flex flex-col lg:flex-row gap-[1rem] px-[1rem] mb-[4rem] lg:mb-[8rem] items-center justify-center'>
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={boxVariants}
              initial='hidden'
              animate={isVisible ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.5 }} // Staggered delay for each box
              className='bg-mbDark w-full sm:max-w-[25rem] py-[2.6rem] rounded-2xl flex flex-col items-center justify-center gap-[1rem]'
            >
              <span className='font-dinot text-[1.2rem] text-white text-center tracking-[0.18rem] leading-none uppercase'>
                {item.tagline}
              </span>
              <span className='font-bold text-[4.45rem] leading-none text-mbYellow'>
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
