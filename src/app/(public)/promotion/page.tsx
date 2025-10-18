
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

/* eslint-disable react/no-unescaped-entities */

const PromotionPage: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex flex-col flex-grow justify-center items-center'>
        {/* Hero Section */}
        <section className='relative flex justify-center items-center bg-[url("/images/header/mb_hero_bg.png")] bg-mbDark bg-cover bg-center w-screen h-screen'>
          <div className='absolute inset-0 bg-mbRed clip-corner'></div>

          <Link href='/' passHref>
            <Image
              src='/images/promo/logo_mb_red_alt.svg'
              alt='Alt Logo'
              width={400}
              height={400}
              className='top-[3.5rem] lg:top-[4.5rem] left-[2rem] z-50 absolute w-[175px] lg:w-[223px] h-auto -translate-y-1/2 transform'
            />
          </Link>

          <Image
            src='/images/promo/logo_birthday.svg'
            alt='Birthday Logo'
            width={400}
            height={400}
            className='top-[15%] lg:top-[35%] left-[50%] lg:left-[20%] z-50 absolute w-[189px] lg:w-[400px] h-auto -translate-x-1/2 transform'
          />

          <Image
            src='/images/promo/promotion_message.svg'
            alt='Promo message'
            width={400}
            height={400}
            className='top-[50%] left-[50%] z-50 absolute w-[250px] lg:w-[500px] h-auto -translate-x-1/2 -translate-y-1/2 transform'
          />

          <Image
            src='/images/promo/generators.png'
            alt='Generators'
            width={400}
            height={400}
            className='right-[50%] lg:right-[5%] bottom-[12%] lg:bottom-[5%] z-50 absolute w-[252px] lg:w-[500px] h-auto translate-x-1/2 lg:-translate-x-0 transform'
          />

          <div className='bottom-[5%] left-[50%] z-50 absolute flex justify-center items-center w-screen lg:w-[411px] h-auto -translate-x-1/2 transform'>
            <span className='font-aleo text-[14px] text-white lg:text-[24px] text-center'>
              Winners announced 1 November 2024
            </span>
          </div>
        </section>

        {/* Entry Rules Section */}
        <section className='py-[4rem]'>
          <SectionHeading title='How to Enter' color='yellow' />
          <div className='mt-4 mb-[2rem] px-12 md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-[1rem] text-white lg:text-[1.6rem] text-center tracking-[0.04rem]'>
            Purchase any items from one of the brands listed below to stand a
            chance to WIN a 9 KVA Generator
          </div>
        </section>

        {/* Brands Section */}
        <section className='flex justify-center items-center bg-white px-4 lg:px-0 py-4 w-screen'>
          <Image
            src='/images/promo/brand-collage.png'
            alt='Brand Collage'
            width={400}
            height={400}
            className='w-full lg:w-[963px] h-auto'
          />
        </section>

        {/* Rules Section */}
        <section className='flex flex-col items-center py-[4rem]'>
          <SectionHeading title='How it Works' color='yellow' />
          <div className='mt-4 mb-[2rem] px-12 md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-[1rem] text-white lg:text-[1.6rem] text-center tracking-[0.04rem]'>
            Submit your receipt details in-store, and you'll be entered into our
            lucky draw, where 16 lucky customers will be randomly selected to
            WIN a 9 KVA generator. The more you shop, the better your chances!
          </div>
          <div className='mb-[2rem] px-12 md:max-w-[35rem] lg:max-w-[60rem] font-dinot text-[1rem] text-white lg:text-[1.6rem] text-center tracking-[0.04rem]'>
            Download our pamphlet to check out the special prices this month for
            our exclusive birthday promotion!
          </div>
          <div className='flex justify-center items-center w-screen'>
            <a
              href='https://drive.google.com/uc?export=download&id=1uclVqq3_kSG3g9_bvBJVlrg3y_rMlAua'
              download
            >
              <button className='bg-mbYellow hover:bg-mbDark focus:ring-opacity-50 shadow-lg hover:shadow-xl px-6 py-3 border-2 hover:border-mbYellow border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-mbYellow font-dinot font-bold text-mbDark hover:text-mbYellow text-lg lg:text-xl hover:scale-105 transition-all duration-300 ease-in-out transform'>
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
