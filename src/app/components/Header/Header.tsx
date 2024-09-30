'use client';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  };

  // Variants for the fade-in of the mobile menu
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Variants for sliding in the nav items one by one
  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2 },
    }),
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }, // Smooth exit
  };

  // Fade-in for the desktop nav
  const desktopNavVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <header id='header'>
      {/* Hamburger Menu Button for Mobile */}
      <Image
        src='/images/header/nav_hamburger.tif.svg'
        alt='Header Image'
        width={28}
        height={28}
        className='fixed top-[2.5rem] right-[2rem] lg:hidden z-30 w-[28px] h-[28px]'
        onClick={toggleMenu}
      />

      {/* Mobile Menu (visible only when isOpen) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`lg:hidden fixed top-0 left-0 w-full h-full bg-mbDark z-40 flex justify-center items-center`}
            variants={menuVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}
          >
            <div className='flex flex-col py-[9rem] px-[2rem] w-full h-screen bg-mbDark font-dinot font-medium text-[2rem] text-white leading-none'>
              {/* Mobile Nav Close Button */}
              <Image
                src='/images/header/nav_cross.tif.svg'
                alt='Close Menu'
                width={28}
                height={28}
                className='absolute top-[2.5rem] right-[2rem]'
                onClick={toggleMenu}
              />

              <Image
                src='/images/header/logo_mb_red.svg'
                alt='Header Image'
                width={28}
                height={28}
                quality={100}
                unoptimized
                className='fixed top-[2.5rem] left-[2rem] lg:hidden z-30 w-[10rem] h-auto'
                onClick={toggleMenu}
              />

              <nav className='flex flex-col gap-[1.5rem] items-start justify-center'>
                {[
                  'About',
                  'Services',
                  'Specials',
                  'Brands',
                  'Branch Locator',
                ].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    onClick={handleOptionClick}
                    className='hover:text-mbYellow'
                    custom={index}
                    variants={itemVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible navigation for larger screens with fade-in effect */}
      <motion.nav
        className='hidden fixed top-[2rem] left-0 right-0 z-40 lg:flex lg:flex-row gap-[1.5rem] lg:gap-[2rem] items-center justify-center font-dinot text-[19px] text-white leading-none bg-[#0D0D0D] px-[3rem] py-[2rem] rounded-full mx-auto w-fit'
        variants={desktopNavVariants}
        initial='hidden'
        animate='visible'
      >
        {['About', 'Services', 'Specials', 'Brands', 'Branch Locator'].map(
          (item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className='hover:text-mbYellow'
            >
              {item}
            </a>
          )
        )}
      </motion.nav>
    </header>
  );
}
