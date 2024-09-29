'use client';
import IconBar from './IconBar/IconBar';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  // Define the animation variants for the hero image
  const imageVariants = {
    hidden: { opacity: 0, y: 50 }, // Start below and transparent
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // End at normal position
  };

  return (
    <section
      id='hero'
      className='w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative bg-[url("/images/header/mb_hero_bg.png")]'
    >
      {/* Hero Text Image with motion for animation */}
      <motion.div
        variants={imageVariants}
        initial='hidden'
        animate='visible' // Always animate to visible on load
        className='flex items-center max-w-full max-h-full object-contain w-[80%] md:w-[60%] lg:w-[50%]'
      >
        <Image
          src='/images/header/logo_mb_red.svg'
          alt='Hero Text'
          width={800}
          height={600}
          className='w-full h-auto'
        />
      </motion.div>

      <IconBar />
    </section>
  );
}
