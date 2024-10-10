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

  return (
    <div className='items-center justify-center overflow-hidden h-full min-h-[100px]'>
      <motion.div
        className='flex space-x-8 whitespace-nowrap items-center'
        animate={{ x: ['100%', '-100%'] }} // Move logos from right to left
        transition={{
          repeat: Infinity, // Infinite loop
          duration: 25, // Adjust speed (seconds)
          ease: 'linear', // Smooth constant speed
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
