import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      id='footer'
      className='flex flex-col items-center px-[2rem] py-[2rem] bg-mbRed rounded-t-3xl'
    >
      {/* Footer Blocks */}
      <div className='flex flex-col lg:flex-row w-full font-dinot text-[1.01rem] text-white text-center'>
        <div className='flex items-center justify-center lg:flex-1'>
          <Image
            src='/images/footer/logo_mb_white.svg'
            alt='Mr Build Full Logo'
            width={200}
            height={100}
            className='w-[252px] h-auto'
          />
        </div>
        <div className='py-[2rem] lg:px-[2rem] border-b lg:border-b-0 lg:border-r-[1px] border-white lg:flex-1'>
          <p className=''>Corner Danie Joubert,</p>
          <p className=''>Claude Wheatley St,</p>
          <p className='mb-[1rem]'>Tzaneen, 0850</p>
          <p className=''>Tel: 015 004 0560</p>
          <p className=''>Email: tzaneen@mrbuild.co.za</p>
        </div>
        <div className='py-[2rem] lg:px-[2rem]  border-b lg:border-b-0 lg:border-r-[1px] border-white lg:flex-1'>
          <p>
            <a href='#about'>About</a>
          </p>
          <p>
            <a href='#services'>Our Services</a>
          </p>
          <p>
            <a href='#branch-locator'>Branch Locator</a>
          </p>
          <p>
            <a href='#brands'>Brands</a>
          </p>
          <p>
            <a href='#contact'>Contact Us</a>
          </p>
        </div>
        <div className='py-[2rem] lg:px-[2rem] lg:flex-1'>
          <p>Follow Us</p>
          <p>
            <a
              href='https://www.facebook.com/profile.php?id=61551736583171'
              target='_blank'
            >
              Facebook
            </a>{' '}
            |{' '}
            <a
              href='https://www.instagram.com/mrbuild_sa/?hl=en'
              target='_blank'
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
      <div className='flex items-center justify-center mt-[2rem] font-dinot text-[11px] text-white'>
        <span>
          Copyright © 2024  AfriBridge Outsourcing Solutions - All Rights
          Reserved
        </span>
      </div>
    </footer>
  );
}
