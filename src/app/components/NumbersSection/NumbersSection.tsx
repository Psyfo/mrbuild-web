import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

const data = [
  { tagline: 'Year Established', value: '1988' },
  { tagline: 'Approximate No. of Staff', value: '320' },
  { tagline: 'Number of Stores', value: '8' },
  { tagline: 'Number of Projects', value: '26' },
];

const NumbersSection: React.FC = () => {
  return (
    <section
      id='numbers'
      className='w-full lg:h-auto bg-black border-t-[9px] border-mbYellow'
    >
      <div className="flex flex-col w-full h-full lg:h-auto bg-[url('/images/about/mb_about_bg.png')] bg-cover bg-center bg-opacity-20 parallax">
        {/* Section Heading */}
        <div className='my-[2rem] lg:mt-[8.5rem] lg:mb-[4rem]'>
          <SectionHeading title='Our Numbers' />
        </div>

        {/* Numbers Boxes */}
        <div className='flex flex-col lg:flex-row gap-[1rem] px-[1rem] mb-[4rem] lg:mb-[8rem] items-center justify-center'>
          {data.map((item, index) => (
            <div
              key={index}
              className='bg-mbDark w-full sm:max-w-[25rem] py-[2.6rem] rounded-2xl flex flex-col items-center justify-center gap-[1rem]'
            >
              <span className='font-dinot text-[1.2rem] text-white text-center tracking-[0.18rem] leading-none uppercase'>
                {item.tagline}
              </span>
              <span className='font-bold text-[4.45rem] leading-none text-mbYellow'>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
