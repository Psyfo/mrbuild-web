import Image from 'next/image';
import React, { useState } from 'react';
import { validateEmail, validateName, validateMessage } from '@/lib/validation';

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

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [touched, setTouched] = useState<{
    [key: string]: boolean;
  }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // First name validation
    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.message!;
    }

    // Last name validation
    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.message!;
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message!;
    }

    // Message validation
    const messageValidation = validateMessage(formData.message, 10);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.message!;
    }

    setValidationErrors(errors);
    // Mark all fields as touched on submit
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
    });
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation if field has been touched
    if (touched[name]) {
      let fieldValidation;

      switch (name) {
        case 'firstName':
          fieldValidation = validateName(value, 'First name');
          setValidationErrors({
            ...validationErrors,
            firstName: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
        case 'lastName':
          fieldValidation = validateName(value, 'Last name');
          setValidationErrors({
            ...validationErrors,
            lastName: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
        case 'email':
          fieldValidation = validateEmail(value);
          setValidationErrors({
            ...validationErrors,
            email: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
        case 'message':
          fieldValidation = validateMessage(value, 10);
          setValidationErrors({
            ...validationErrors,
            message: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    // Validate on blur
    let fieldValidation;

    switch (field) {
      case 'firstName':
        fieldValidation = validateName(formData.firstName, 'First name');
        setValidationErrors({
          ...validationErrors,
          firstName: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
      case 'lastName':
        fieldValidation = validateName(formData.lastName, 'Last name');
        setValidationErrors({
          ...validationErrors,
          lastName: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
      case 'email':
        fieldValidation = validateEmail(formData.email);
        setValidationErrors({
          ...validationErrors,
          email: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
      case 'message':
        fieldValidation = validateMessage(formData.message, 10);
        setValidationErrors({
          ...validationErrors,
          message: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormStatus({ success: false, error: false, loading: false });
      return;
    }

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
        setValidationErrors({});
        setTouched({});
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
      <form onSubmit={handleSubmit} noValidate>
        <div className='mb-4'>
          <label
            htmlFor='firstName'
            className='block font-dinot font-medium text-[19.39px] text-white'
          >
            First Name*
          </label>
          <input
            type='text'
            name='firstName'
            id='firstName'
            value={formData.firstName}
            onChange={handleChange}
            onBlur={() => handleBlur('firstName')}
            className={`mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none transition-colors ${
              validationErrors.firstName && touched.firstName
                ? 'border-red-500'
                : 'border-gray-500'
            }`}
            disabled={formStatus.loading || formStatus.success}
            aria-invalid={
              validationErrors.firstName && touched.firstName ? true : false
            }
            aria-describedby={
              validationErrors.firstName && touched.firstName
                ? 'firstName-error'
                : undefined
            }
          />
          {validationErrors.firstName && touched.firstName && (
            <p
              id='firstName-error'
              className='flex items-center gap-1.5 slide-in-from-top-1 mt-1.5 text-red-400 text-xs animate-in duration-200'
              role='alert'
            >
              <svg
                className='flex-shrink-0 w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {validationErrors.firstName}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='lastName'
            className='block font-dinot font-medium text-[19.39px] text-white'
          >
            Last Name*
          </label>
          <input
            type='text'
            name='lastName'
            id='lastName'
            value={formData.lastName}
            onChange={handleChange}
            onBlur={() => handleBlur('lastName')}
            className={`mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none transition-colors ${
              validationErrors.lastName && touched.lastName
                ? 'border-red-500'
                : 'border-gray-500'
            }`}
            disabled={formStatus.loading || formStatus.success}
            aria-invalid={
              validationErrors.lastName && touched.lastName ? true : false
            }
            aria-describedby={
              validationErrors.lastName && touched.lastName
                ? 'lastName-error'
                : undefined
            }
          />
          {validationErrors.lastName && touched.lastName && (
            <p
              id='lastName-error'
              className='flex items-center gap-1.5 slide-in-from-top-1 mt-1.5 text-red-400 text-xs animate-in duration-200'
              role='alert'
            >
              <svg
                className='flex-shrink-0 w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {validationErrors.lastName}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block font-dinot font-medium text-[19.39px] text-white'
          >
            Email*
          </label>
          <input
            type='email'
            name='email'
            id='email'
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={`mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none transition-colors ${
              validationErrors.email && touched.email
                ? 'border-red-500'
                : 'border-gray-500'
            }`}
            disabled={formStatus.loading || formStatus.success}
            autoComplete='email'
            aria-invalid={
              validationErrors.email && touched.email ? true : false
            }
            aria-describedby={
              validationErrors.email && touched.email
                ? 'email-error'
                : undefined
            }
          />
          {validationErrors.email && touched.email && (
            <p
              id='email-error'
              className='flex items-center gap-1.5 slide-in-from-top-1 mt-1.5 text-red-400 text-xs animate-in duration-200'
              role='alert'
            >
              <svg
                className='flex-shrink-0 w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {validationErrors.email}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='message'
            className='block font-dinot font-medium text-[19.39px] text-white'
          >
            Message*
          </label>
          <textarea
            name='message'
            id='message'
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur('message')}
            className={`mt-1 p-2 w-full border-b bg-mbDark font-dinot text-white focus:outline-none transition-colors ${
              validationErrors.message && touched.message
                ? 'border-red-500'
                : 'border-gray-500'
            }`}
            disabled={formStatus.loading || formStatus.success}
            aria-invalid={
              validationErrors.message && touched.message ? true : false
            }
            aria-describedby={
              validationErrors.message && touched.message
                ? 'message-error'
                : undefined
            }
          />
          {validationErrors.message && touched.message && (
            <p
              id='message-error'
              className='flex items-center gap-1.5 slide-in-from-top-1 mt-1.5 text-red-400 text-xs animate-in duration-200'
              role='alert'
            >
              <svg
                className='flex-shrink-0 w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {validationErrors.message}
            </p>
          )}
        </div>
        <button
          type='submit'
          disabled={formStatus.loading}
          className='flex items-center gap-2 bg-mbYellow hover:bg-mbDark focus:ring-opacity-50 disabled:opacity-60 shadow-lg hover:shadow-xl px-6 py-3 border-2 hover:border-mbYellow border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-mbYellow font-dinot font-bold text-mbDark hover:text-mbYellow text-lg lg:text-xl hover:scale-105 transition-all duration-300 ease-in-out disabled:cursor-not-allowed transform'
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
        <p className='mt-4 font-dinot font-semibold text-green-400 text-lg text-center'>
          ✅ Your message has been sent successfully!
        </p>
      )}
      {formStatus.error && (
        <p className='mt-4 font-dinot font-semibold text-red-500 text-lg text-center'>
          ❌ Something went wrong. Please try again later.
        </p>
      )}
    </div>
  );
};

export default ContactForm;
