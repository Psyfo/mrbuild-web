import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

// Replace with actual icons
const IconBar = () => {
  // Array of image sources and names for your icons
  const iconData = [
    { src: '/images/header/icon_electrical.svg', name: 'Electrical' },
    { src: '/images/header/icon_plumbing.svg', name: 'Plumbing' },
    { src: '/images/header/icon_tools.svg', name: 'Tools' },
    {
      src: '/images/header/icon_building-material.svg',
      name: 'Building Material',
    },
    { src: '/images/header/icon_paint.svg', name: 'Paint' },
    { src: '/images/header/icon_doors.svg', name: 'Wrapped Doors' },
    { src: '/images/header/icon_cutting.svg', name: 'Edging & Cutting' },
    { src: '/images/header/icon_diy.svg', name: 'DIY' },
  ];

  // Animation variants for the icon and text
  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2, // Delay for staggered effect
        duration: 0.5,
      },
    }),
  };

  return (
    <div className='bottom-0 left-1/2 z-10 absolute flex flex-wrap justify-center items-start gap-y-4 bg-mbRed px-[1rem] lg:px-[3.125rem] py-[1rem] lg:border-white lg:border-r rounded-2xl xl:rounded-full w-[95vw] md:w-[65vw] lg:w-[65%] h-auto -translate-x-1/2 translate-y-1/2 transform'>
      {iconData.map(({ src, name }, idx) => (
        <div
          key={idx}
          className='flex flex-col xl:flex-1 justify-center items-center py-[1rem] w-1/4 h-auto lg:h-auto'
        >
          <motion.div
            variants={iconVariants}
            initial='hidden'
            animate='visible'
            custom={idx} // Pass the index to control the delay
            className='flex justify-center items-center w-auto h-[3rem] lg:h-[4rem]'
          >
            <Image
              src={src}
              alt={name}
              width={50}
              height={50}
              className='w-auto h-full'
              priority={idx === 0 || idx === 7} // Add priority to first (electrical) and last (diy) icons
            />
          </motion.div>
          <motion.span
            variants={iconVariants}
            initial='hidden'
            animate='visible'
            custom={idx} // Match the index for the same delay
            className='mt-[10px] text-[0.8rem] text-white lg:text-[1rem] text-center tracking-[0.1rem]'
          >
            {name}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

export default IconBar;
