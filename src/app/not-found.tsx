import { Metadata } from 'next';
/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | MrBuild',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className='flex justify-center items-center bg-mbDark px-4 min-h-screen'>
      <div className='mx-auto max-w-4xl text-center'>
        {/* Logo */}
        <div className='mb-6 md:mb-8'>
          <Image
            src='/images/logo_mrbuild.svg'
            alt='MrBuild Logo'
            width={150}
            height={60}
            className='mx-auto md:w-[200px] h-auto md:h-[80px]'
          />
        </div>

        {/* 404 Number with Construction Theme */}
        <div className='relative mb-6 md:mb-8'>
          <h1 className='mb-3 md:mb-4 font-aleo font-bold text-mbYellow text-6xl md:text-8xl lg:text-9xl'>
            404
          </h1>
          <div className='-top-2 md:-top-4 lg:-top-8 -right-2 md:-right-4 lg:-right-8 absolute'>
            <Image
              src='/images/services/icon_services_tools.svg'
              alt='Construction tools'
              width={40}
              height={40}
              className='md:w-[60px] md:h-[60px] animate-pulse-slow'
            />
          </div>
        </div>

        {/* Error Message */}
        <div className='mb-6 md:mb-8'>
          <h2 className='mb-3 md:mb-4 font-aleo font-bold text-white text-xl md:text-2xl lg:text-4xl'>
            Oops! This page is under construction
          </h2>
          <p className='mx-auto px-2 max-w-2xl font-dinot text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed'>
            It looks like this page has been demolished or moved to a new
            location. Don't worry, our team is working hard to build something
            amazing for you.
          </p>
        </div>

        {/* Construction Elements */}
        <div className='flex justify-center items-center gap-3 md:gap-4 mb-8 md:mb-12'>
          <div className='bg-mbRed p-3 md:p-4 rounded-lg animate-pulse'>
            <Image
              src='/images/services/icon_services_building-materials.svg'
              alt='Building materials'
              width={32}
              height={32}
              className='md:w-[40px] md:h-[40px]'
            />
          </div>
          <div className='bg-mbYellow p-3 md:p-4 rounded-lg animate-pulse delay-300'>
            <Image
              src='/images/services/icon_services_electrical.svg'
              alt='Electrical'
              width={32}
              height={32}
              className='md:w-[40px] md:h-[40px]'
            />
          </div>
          <div className='bg-mbRed p-3 md:p-4 rounded-lg animate-pulse delay-700'>
            <Image
              src='/images/services/icon_services_plumbing.svg'
              alt='Plumbing'
              width={32}
              height={32}
              className='md:w-[40px] md:h-[40px]'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex sm:flex-row flex-col justify-center items-center gap-3 md:gap-4 mb-6 md:mb-8'>
          <Link
            href='/'
            className='flex justify-center items-center gap-2 bg-mbRed hover:bg-red-700 px-6 md:px-8 py-3 md:py-4 rounded-lg w-full sm:w-auto font-dinot font-bold text-white text-sm md:text-base transition-colors duration-300'
          >
            <svg
              className='w-4 md:w-5 h-4 md:h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Back to Home
          </Link>

          <Link
            href='#services'
            className='flex justify-center items-center gap-2 bg-mbYellow hover:bg-yellow-400 px-6 md:px-8 py-3 md:py-4 rounded-lg w-full sm:w-auto font-dinot font-bold text-mbDark text-sm md:text-base transition-colors duration-300'
          >
            <svg
              className='w-4 md:w-5 h-4 md:h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1'
              />
            </svg>
            View Our Services
          </Link>
        </div>

        {/* Quick Links */}
        <div className='pt-6 md:pt-8 border-gray-700 border-t'>
          <h3 className='mb-3 md:mb-4 font-aleo font-bold text-white text-lg md:text-xl'>
            Quick Links
          </h3>
          <div className='flex flex-wrap justify-center gap-3 md:gap-4'>
            <Link
              href='/#about'
              className='font-dinot text-gray-300 hover:text-mbYellow text-sm md:text-base transition-colors duration-300'
            >
              About Us
            </Link>
            <Link
              href='/#services'
              className='font-dinot text-gray-300 hover:text-mbYellow text-sm md:text-base transition-colors duration-300'
            >
              Services
            </Link>
            <Link
              href='/#brands'
              className='font-dinot text-gray-300 hover:text-mbYellow text-sm md:text-base transition-colors duration-300'
            >
              Brands
            </Link>
            <Link
              href='/#branches'
              className='font-dinot text-gray-300 hover:text-mbYellow text-sm md:text-base transition-colors duration-300'
            >
              Branch Locator
            </Link>
            <Link
              href='/#contact'
              className='font-dinot text-gray-300 hover:text-mbYellow text-sm md:text-base transition-colors duration-300'
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className='mt-6 md:mt-8 font-dinot text-gray-400 text-xs md:text-sm'>
          <p className='mb-1'>Need help? Contact us at:</p>
          <p className='flex sm:flex-row flex-col justify-center items-center gap-1 sm:gap-0'>
            <a
              href='tel:+27150040560'
              className='text-mbYellow hover:underline'
            >
              +27-15-004-0560
            </a>
            <span className='hidden sm:inline'> | </span>
            <a
              href='mailto:info@mrbuild.co.za'
              className='text-mbYellow hover:underline'
            >
              info@mrbuild.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
