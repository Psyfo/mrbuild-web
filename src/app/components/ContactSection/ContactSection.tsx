'use client';
import ContactForm from './ContactForm/ContactForm';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { motion } from 'framer-motion';

const ContactSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the section is visible
        }
      },
      { threshold: 0.1 } // Adjust this value as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Variants for animations
  const headingVariants = {
    hidden: { opacity: 0, y: -20 }, // Start above
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 }, // Start below
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }, // Fade in after heading
    },
  };

  return (
    <section ref={sectionRef} id='contact' className='flex w-full bg-mbDark'>
      <div className='w-full lg:w-[40%] pb-[4rem]'>
        {/* Section Heading */}
        <motion.div
          variants={headingVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
          className='py-[4rem]'
        >
          <SectionHeading title='Contact Us' />
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={formVariants}
          initial='hidden'
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <ContactForm />
        </motion.div>
      </div>
      <div className='hidden lg:block w-[60%] h-auto bg-[url("/images/contact/bg_contact_tools.png")] bg-cover bg-center'>
        tools
      </div>
    </section>
  );
};

export default ContactSection;
