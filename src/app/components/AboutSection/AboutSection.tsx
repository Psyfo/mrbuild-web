import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

const AboutSection: React.FC = () => {
  return (
    <section id='about' className='bg-black'>
      <div className="flex flex-col lg:flex-row w-full bg-[url('/images/about/mb_about_bg.png')] bg-cover bg-center bg-opacity-20 parallax">
        {/* Section Heading */}
        <div className='lg:w-1/3 mt-[12rem] lg:mt-[13.5rem] mb-[2rem] '>
          <SectionHeading title='About Us' />
        </div>

        {/* About Text */}
        <div className='flex-1 px-[3rem] pt-[2rem] pb-[6rem] lg:pb-[8rem] lg:mt-[12.5rem] bg-black bg-opacity-40 rounded-t-2xl font-dinot font-bold'>
          <p className='text-white text-[1rem] lg:text-[1.56rem] mb-8'>
            We specialise in high-quality building materials, tools, and
            accessories. Our knowledgeable and friendly support team is
            available to assist you with any inquiries, product recommendations,
            or technical assistance you may require.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] mb-8'>
            We take pride in our commitment to customer satisfaction. We value
            your time and aim to provide prompt shipping and reliable delivery
            services, so you can start your projects without delay.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] mb-8'>
            Mr. Build understands the importance of affordability. We offer
            competitive pricing on all our products, feature special promotions,
            discounts, and bundle deals, helping you save even more while
            maintaining the highest quality standards.
          </p>
          <p className='text-white text-[1rem] lg:text-[1.56rem] mb-8'>
            Join the Mr. Build community today with our extensive product range,
            superior customer service, and commitment to excellence, we are here
            to empower your building endeavours every step of the way.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
