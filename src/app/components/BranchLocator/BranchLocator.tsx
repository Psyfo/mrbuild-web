'use client';
import BranchMap from './BranchMap/BranchMap';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

const BranchLocator: React.FC = () => {
  return (
    <section id='branch-locator' className='bg-mbDark'>
      {/* Section Heading */}
      <div className='flex flex-col items-center py-[4rem]'>
        <SectionHeading
          title='Branch Locator'
          subtitle='Find your nearest Mr. Build branch easily with our branch locator. We have conveniently located stores across South Africa. Locate your nearest branch today and let us assist you with all your construction needs.'
        />
        <div className='round border-[3px] border-mbYellow rounded-lg mt-[1rem] mx-[0] px-[1rem] lg:px-[4rem] py-[1rem] font-dinot text-[1rem] lg:text-[1.9rem] text-white tracking-[0.04rem]'>
          <div className='mb-[1rem] lg:mb-[2rem]'>Our operating hours are:</div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Mon - Fri</span>
            <span>07:30 - 13:00, 14:00 - 16:30</span>
          </div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Sat</span>
            <span>07:30 - 12:30</span>
          </div>

          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Sun</span>
            <span>Closed</span>
          </div>
          <div className='flex'>
            <span className='w-[6rem] lg:w-[15rem]'>Public Holidays</span>
            <span>Hours might differ</span>
          </div>
        </div>
      </div>

      {/* Branch Locator  */}
      <BranchMap />
    </section>
  );
};

export default BranchLocator;
