'use client';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { motion } from 'framer-motion';

/* eslint-disable react-hooks/exhaustive-deps */

const AboutSection: React.FC = () => {
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
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5, // Delay for the text to fade in after the heading
      },
    },
  };

  return (
    <section ref={sectionRef} id='about' className='bg-black'>
      <div className="flex flex-col lg:flex-row w-full bg-[url('/images/about/mb_about_bg.png')] bg-cover bg-center bg-opacity-20 parallax">
        {/* Section Heading with Fade-in Animation */}
        <motion.div
          className='lg:w-1/3 mt-[12rem] lg:mt-[13.5rem] mb-[2rem]'
          variants={headingVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <SectionHeading title='About Us' />
        </motion.div>

        {/* About Text with Fade-in Animation */}
        <motion.div
          className='flex-1 px-[3rem] pt-[2rem] pb-[6rem] lg:pb-[8rem] lg:mt-[12.5rem] bg-black bg-opacity-40 rounded-t-2xl font-dinot font-bold'
          variants={textVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <p className='text-white text-[1rem] lg:text-[1.56rem] text-center lg:text-left mb-8'>
            We specialize in high-quality building materials, tools, and
            accessories. Our knowledgeable and friendly support team is
            available to assist you with any inquiries, product recommendations,
            or technical assistance you may require.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] text-center lg:text-left mb-8'>
            We take pride in our commitment to customer satisfaction. We value
            your time and aim to provide prompt shipping and reliable delivery
            services, so you can start your projects without delay.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] text-center lg:text-left mb-8'>
            Mr. Build understands the importance of affordability. We offer
            competitive pricing on all our products, feature special promotions,
            discounts, and bundle deals, helping you save even more while
            maintaining the highest quality standards.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] text-center lg:text-left mb-8'>
            Join the Mr. Build community today with our extensive product range,
            superior customer service, and commitment to excellence, we are here
            to empower your building endeavors every step of the way.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
