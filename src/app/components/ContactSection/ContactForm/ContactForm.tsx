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

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus({ success: true, error: false });
        setFormData({ firstName: '', lastName: '', email: '', message: '' }); // Reset the form
      } else {
        setFormStatus({ success: false, error: true });
      }
    } catch (err) {
      setFormStatus({ success: false, error: true });
      console.log(err);
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
          className='w-auto px-[2rem] py-[0.6rem] bg-mbYellow font-dinot font-bold text-[19.39px] lg:text-[27px] leading-none text-mbDark rounded-full hover:bg-mbDark hover:text-mbYellow transition-colors'
        >
          Submit
        </button>
      </form>

      {/* Show success or error messages */}
      {formStatus.success && (
        <p className='text-green-600 mt-4'>Message sent successfully!</p>
      )}
      {formStatus.error && (
        <p className='text-red-600 mt-4'>
          Failed to send message. Try again later.
        </p>
      )}
    </div>
  );
};

export default ContactForm;
