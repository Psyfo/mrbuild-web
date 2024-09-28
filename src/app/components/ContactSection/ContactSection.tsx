'use client';
import ContactForm from './ContactForm/ContactForm';
import React from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

const ContactSection: React.FC = () => {
  return (
    <section id='contact' className='flex w-full bg-mbDark'>
      <div className='w-full lg:w-[40%] pb-[4rem]'>
        {/* Section Heading */}
        <div className='py-[4rem]'>
          <SectionHeading title='Contact Us' />
        </div>

        {/* Contact Form */}
        <div className=''>
          <ContactForm />
        </div>
      </div>
      <div className='hidden lg:block w-[60%] h-auto bg-[url("/images/contact/bg_contact_tools.png")] bg-cover bg-center'>
        tools
      </div>
    </section>
  );
};

export default ContactSection;
