'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Announcement: React.FC = () => {
  return (
    <a href='/promotion'>
      <div className='flex items-center w-screen h-[2rem] lg:h-[2rem] bg-mbYellow overflow-hidden'>
        <motion.div
          className='font-dinot font-bold w-full text-[19px] uppercase whitespace-nowrap'
          animate={{ x: ['100%', '-100%'] }} // Move from right to left
          transition={{
            repeat: Infinity, // Infinite loop
            duration: 15, // Adjust speed (seconds)
            ease: 'linear', // Smooth constant speed
          }}
        >
          <span className='mr-[3rem]'>Win a generator birthday promo</span>
          <span className='mr-[3rem]'>Win a generator birthday promo</span>
          <span className='mr-[3rem]'>Win a generator birthday promo</span>
          <span className='mr-[3rem]'>Win a generator birthday promo</span>
        </motion.div>
      </div>
    </a>
  );
};

export default Announcement;
