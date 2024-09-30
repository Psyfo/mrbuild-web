import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

/* eslint-disable react/no-unescaped-entities */

const PromotionPage: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow flex flex-col items-center justify-center'>
        {/* Hero Section */}
        <section className='relative w-screen h-screen flex items-center justify-center bg-[url("/images/header/mb_hero_bg.png")] bg-mbDark bg-cover bg-center'>
          <div className='absolute inset-0 bg-mbRed clip-corner'></div>

          <Link href='/' passHref>
            <Image
              src='/images/promo/logo_mb_red_alt.svg'
              alt='Alt Logo'
              width={400}
              height={400}
              className='w-[175px] lg:w-[223px] h-auto absolute z-50 top-[3.5rem] lg:top-[4.5rem] left-[2rem] transform -translate-y-1/2'
            />
          </Link>

          <Image
            src='/images/promo/logo_birthday.svg'
            alt='Birthday Logo'
            width={400}
            height={400}
            className='w-[189px] lg:w-[400px] h-auto absolute z-50 top-[15%] lg:top-[35%] left-[50%] lg:left-[20%] transform -translate-x-1/2'
          />

          <Image
            src='/images/promo/promotion_message.svg'
            alt='Promo message'
            width={400}
            height={400}
            className='w-[250px] lg:w-[500px] h-auto absolute z-50 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2'
          />

          <Image
            src='/images/promo/generators.png'
            alt='Generators'
            width={400}
            height={400}
            className='w-[252px] lg:w-[500px] h-auto absolute z-50 bottom-[12%] lg:bottom-[5%] right-[50%] lg:right-[5%] transform translate-x-1/2 lg:-translate-x-0'
          />

          <div className='w-screen flex items-center justify-center lg:w-[411px] h-auto absolute z-50 bottom-[5%] left-[50%] transform -translate-x-1/2'>
            <span className='font-aleo text-white text-center text-[14px] lg:text-[24px]'>
              Winners announced 1 November 2024
            </span>
          </div>
        </section>

        {/* Entry Rules Section */}
        <section className='py-[4rem]'>
          <SectionHeading title='How to Enter' color='yellow' />
          <div className='md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-center text-[1rem] text-white lg:text-[1.6rem] tracking-[0.04rem] mb-[2rem] mt-4 px-12'>
            Purchase any items from one of the brands listed below to stand a
            chance to WIN a 9 KVA Generator
          </div>
        </section>

        {/* Brands Section */}
        <section className='bg-white w-screen flex items-center justify-center px-4 lg:px-0 py-4'>
          <Image
            src='/images/promo/brand-collage.png'
            alt='Brand Collage'
            width={400}
            height={400}
            className='w-full lg:w-[963px] h-auto'
          />
        </section>

        {/* Rules Section */}
        <section className='py-[4rem] flex flex-col items-center'>
          <SectionHeading title='How it Works' color='yellow' />
          <div className='md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-center text-[1rem] text-white lg:text-[1.6rem] tracking-[0.04rem] mb-[2rem] mt-4 px-12'>
            Submit your receipt details in-store, and you'll be entered into our
            lucky draw, where 16 lucky customers will be randomly selected to
            WIN a 9 KVA generator. The more you shop, the better your chances!
          </div>
          <div className='md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-center text-[1rem] text-white lg:text-[1.6rem] tracking-[0.04rem] mb-[2rem] px-12'>
            Download our pamphlet to check out the special prices this month for
            our exclusive birthday promotion!
          </div>
          <div className='w-screen flex items-center justify-center'>
            <a
              href='https://drive.google.com/uc?export=download&id=1uclVqq3_kSG3g9_bvBJVlrg3y_rMlAua'
              download
            >
              <button className='px-6 py-3 bg-mbYellow text-mbDark font-dinot font-bold text-lg lg:text-xl rounded-full border-2 border-transparent hover:bg-mbDark hover:text-mbYellow hover:border-mbYellow shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-mbYellow focus:ring-opacity-50'>
                Download
              </button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromotionPage;
