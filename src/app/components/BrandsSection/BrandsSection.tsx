import BrandMarquee from './BrandMarquee/BrandMarquee';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

const BrandsSection: React.FC = () => {
  return (
    <section id='brands' className='bg-white w-full'>
      {/* Section Heading */}
      <div className='my-[4rem]'>
        <SectionHeading title='Brands' color='black' />
      </div>

      {/* Brand Marquee */}
      <div className='mb-[4rem]'>
        <BrandMarquee />
      </div>
    </section>
  );
};

export default BrandsSection;
