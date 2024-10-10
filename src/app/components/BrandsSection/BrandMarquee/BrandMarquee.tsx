import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const BrandMarquee: React.FC = () => {
  const logos = [
    '/images/brands/brand_eureka.png',
    '/images/brands/brand_ruwag.png',
    '/images/brands/brand_pgbison.png',
    '/images/brands/brand_national-edging.png',
    '/images/brands/brand_academy.png',
    '/images/brands/brand_cornice-maker.png',
    '/images/brands/brand_dulux.png',
    '/images/brands/brand_fortknox.png',
    '/images/brands/brand_glue-devil.png',
    '/images/brands/brand_harvey.png',
    '/images/brands/brand_jojo.png',
    '/images/brands/brand_lasher.png',
    '/images/brands/brand_makita.png',
    '/images/brands/brand_matus.png',
    '/images/brands/brand_nutec.png',
    '/images/brands/brand_pbes.png',
    '/images/brands/brand_tork-craft.png',
    '/images/brands/brand_xpanda.png',
    '/images/brands/brand_bostik.png',
    '/images/brands/brand_hamiltons.png',
    '/images/brands/brand_bosch.png',
    '/images/brands/brand_lafarge.png',
    '/images/brands/brand_sunridge.png',
    '/images/brands/brand_waco.png',
  ];

  // Adjust duration based on screen size
  const getDuration = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) return 50; // Slower on larger screens
      if (screenWidth >= 768) return 30; // Medium speed on tablets
    }
    return 20; // Faster on mobile screens
  };

  return (
    <div className='items-center justify-center overflow-hidden h-full min-h-[100px]'>
      <motion.div
        className='flex space-x-8 whitespace-nowrap items-center'
        animate={{ x: ['100%', '-210%'] }}
        transition={{
          repeat: Infinity,
          duration: getDuration(), // Dynamically adjust duration
          ease: 'linear',
        }}
      >
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo}
            alt={`Brand logo ${index + 1}`}
            width={100}
            height={96}
            className='w-[20rem] h-auto object-contain'
          />
        ))}
      </motion.div>
    </div>
  );
};

export default BrandMarquee;
