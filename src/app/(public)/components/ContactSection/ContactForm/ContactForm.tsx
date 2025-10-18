import Image from 'next/image';
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    success: false,
    error: false,
    loading: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ success: false, error: false, loading: true });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus({ success: true, error: false, loading: false });
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setFormStatus({ success: false, error: true, loading: false });
      }
    } catch (err) {
      console.log(err);
      setFormStatus({ success: false, error: true, loading: false });
    }
  };

  return (
    <div className='px-[2rem]'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='firstName'
            className='block font-dinot text-[19.39px] font-medium text-white'
          >
            First Name*
          </label>
          <input
            type='text'
            name='firstName'
            id='firstName'
            value={formData.firstName}
            onChange={handleChange}
            className='mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='lastName'
            className='block font-dinot text-[19.39px] font-medium text-white'
          >
            Last Name*
          </label>
          <input
            type='text'
            name='lastName'
            id='lastName'
            value={formData.lastName}
            onChange={handleChange}
            className='mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block font-dinot text-[19.39px] font-medium text-white'
          >
            Email*
          </label>
          <input
            type='email'
            name='email'
            id='email'
            value={formData.email}
            onChange={handleChange}
            className='mt-1 p-2 w-full border-b bg-mbDark  font-dinot text-white focus:outline-none'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='message'
            className='block font-dinot text-[19.39px] font-medium text-white'
          >
            Message*
          </label>
          <textarea
            name='message'
            id='message'
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className='mt-1 p-2 w-full border-b bg-mbDark  font-dinot text-white focus:outline-none'
            required
          />
        </div>
        <button
          type='submit'
          disabled={formStatus.loading}
          className='px-6 py-3 bg-mbYellow text-mbDark font-dinot font-bold text-lg lg:text-xl rounded-full border-2 border-transparent hover:bg-mbDark hover:text-mbYellow hover:border-mbYellow shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-mbYellow focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
        >
          {formStatus.loading ? (
            <>
              Sending...
              <Image
                src='/images/logo_mrbuild.svg'
                alt='Sending'
                width={24}
                height={24}
                className='animate-pulse-slow'
              />
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      {/* Show success or error messages */}
      {formStatus.success && (
        <p className='mt-4 text-center text-lg font-dinot font-semibold text-green-400'>
          ✅ Your message has been sent successfully!
        </p>
      )}
      {formStatus.error && (
        <p className='mt-4 text-center text-lg font-dinot font-semibold text-red-500'>
          ❌ Something went wrong. Please try again later.
        </p>
      )}
    </div>
  );
};

export default ContactForm;
