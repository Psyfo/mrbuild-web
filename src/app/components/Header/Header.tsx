"use client";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  };

  return (
    <header id='header'>
      {/* Hamburger Menu Button */}
      <Image
        src='/images/header/nav_hamburger.tif.svg'
        alt='Header Image'
        width={28}
        height={28}
        className='fixed top-[2.5rem] right-[2rem] lg:hidden z-30'
        onClick={toggleMenu}
      />
      <div
        className={`transition-all duration-3000 ${
          isOpen ? 'block' : 'hidden'
        } lg:block`}
      >
        <div className='fixed top-0 lg:top-[2rem] left-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 flex flex-col py-[9rem] lg:py-[2rem] px-[2rem] w-full lg:w-auto h-screen lg:h-auto bg-mbDark font-aleo font-medium text-[2rem] lg:text-[1.1rem] text-white z-40 lg:rounded-full'>
          <Image
            id='nav-close'
            src='/images/header/mb_hero.svg'
            alt='Header Image'
            width={50}
            height={50}
            className='w-[10rem] absolute top-[0rem] left-[1rem] lg:hidden'
          />
          <Image
            src='/images/header/nav_cross.tif.svg'
            alt='Header Image'
            width={28}
            height={28}
            className='absolute top-[2.5rem] right-[2rem] lg:hidden'
            onClick={toggleMenu}
          />

          <nav className='flex flex-col lg:flex-row gap-[0.5rem] lg:gap-[2rem] justify-center rounded-full'>
            <a
              href='#about'
              onClick={handleOptionClick}
              className='hover:text-mbYellow'
            >
              About
            </a>
            <a
              href='#services'
              onClick={handleOptionClick}
              className='hover:text-mbYellow'
            >
              Services
            </a>
            <a
              href='#specials'
              onClick={handleOptionClick}
              className='hover:text-mbYellow'
            >
              Specials
            </a>
            <a
              href='#brands'
              onClick={handleOptionClick}
              className='hover:text-mbYellow'
            >
              Brands
            </a>
            <a
              href='#locator'
              onClick={handleOptionClick}
              className='hover:text-mbYellow'
            >
              Branch Locator
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
