import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      id='footer'
      className='flex flex-col items-center bg-mbRed px-[2rem] py-[2rem] rounded-t-3xl'
    >
      {/* Footer Blocks */}
      <div className='flex lg:flex-row flex-col w-full font-dinot text-[1.01rem] text-white text-center'>
        <div className='flex lg:flex-1 justify-center items-center'>
          <Image
            src='/images/footer/logo_mb_white.svg'
            alt='Mr Build Full Logo'
            width={200}
            height={100}
            className='w-[252px] h-auto'
          />
        </div>
        <div className='lg:flex-1 lg:px-[2rem] py-[2rem] border-white lg:border-r-[1px] border-b lg:border-b-0'>
          <p className=''>Corner Danie Joubert,</p>
          <p className=''>Claude Wheatley St,</p>
          <p className='mb-[1rem]'>Tzaneen, 0850</p>
          <p className=''>Tel: 015 004 0560</p>
          <p className=''>Email: tzaneen@mrbuild.co.za</p>
        </div>
        <div className='lg:flex-1 lg:px-[2rem] py-[2rem] border-white lg:border-r-[1px] border-b lg:border-b-0'>
          <p>
            <Link href='/#about'>About</Link>
          </p>
          <p>
            <Link href='/#services'>Our Services</Link>
          </p>
          <p>
            <Link href='/#branch-locator'>Branch Locator</Link>
          </p>
          <p>
            <Link href='/#brands'>Brands</Link>
          </p>
          <p>
            <Link href='/#contact'>Contact Us</Link>
          </p>
        </div>
        <div className='lg:flex-1 lg:px-[2rem] py-[2rem]'>
          <p>Follow Us</p>
          <p>
            <a
              href='https://www.facebook.com/profile.php?id=61551736583171'
              target='_blank'
              rel='noopener noreferrer'
            >
              Facebook
            </a>{' '}
            |{' '}
            <a
              href='https://www.instagram.com/mrbuild_sa/?hl=en'
              target='_blank'
              rel='noopener noreferrer'
            >
              Instagram
            </a>
          </p>
          <p>
            <a href='#contact' target='_blank'>
              LinkedIn
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className='flex justify-center items-center mt-[2rem] font-dinot text-[11px] text-white text-center'>
        <span>
          Copyright © 2024  AfriBridge Outsourcing Solutions - All Rights
          Reserved
        </span>
      </div>
    </footer>
  );
}
