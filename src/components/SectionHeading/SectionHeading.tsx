import './../SectionHeading/SectionHeading';
import Image from 'next/image';
import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  color?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  color,
}) => {
  const textColor =
    color === 'black'
      ? 'text-black'
      : color === 'yellow'
      ? 'text-mbYellow'
      : 'text-white';

  return (
    <div className='flex flex-col gap-[1rem] items-center'>
      <div className='flex flex-col lg:flex-row gap-[1rem] items-center justify-center'>
        <Image
          src='/images/logo_mrbuild.svg'
          alt='MR Build Logo'
          width={52}
          height={53}
          className='w-[3.2rem] lg:w-[5.3rem]'
        />
        <h1
          className={`font-aleo font-medium ${textColor} text-center text-[2rem] lg:text-[3.2rem]`}
        >
          {title}
        </h1>
      </div>
      {subtitle && (
        <h2
          className={`md:max-w-[35rem] lg:max-w-[60rem] font-dinot ${textColor} text-center text-[0.9rem] lg:text-[1.3rem] tracking-[0.04rem] mb-[2rem] px-12`}
        >
          {subtitle}
        </h2>
      )}
    </div>
  );
};

export default SectionHeading;
