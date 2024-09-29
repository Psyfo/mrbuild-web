import Image from 'next/image';
import React from 'react';

// Replace with actual icons
const IconBar = () => {
  // Array of image sources and names for your icons
  const iconData = [
    { src: '/images/header/icon_electrical.svg', name: 'Electrical' },
    { src: '/images/header/icon_plumbing.svg', name: 'Plumbing' },
    { src: '/images/header/icon_tools.svg', name: 'Tools' },
    {
      src: '/images/header/icon_building-material.svg',
      name: 'Building Material',
    },
    { src: '/images/header/icon_paint.svg', name: 'Paint' },
    { src: '/images/header/icon_doors.svg', name: 'Wrapped Doors' },
    { src: '/images/header/icon_cutting.svg', name: 'Edging & Cutting' },
    { src: '/images/header/icon_diy.svg', name: 'DIY' },
  ];

  return (
    <div className='flex flex-wrap gap-y-4 items-start justify-center bg-mbRed w-[95vw] md:w-[65vw] lg:w-[65%] h-auto px-[1rem] lg:px-[3.125rem] py-[1rem] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform z-10 rounded-2xl xl:rounded-full lg:border-r lg:border-white'>
      {iconData.map(({ src, name }, idx) => (
        <div
          key={idx}
          className='flex flex-col items-center justify-center w-1/4 xl:flex-1 h-auto lg:h-auto py-[1rem]'
        >
          <div className='flex items-center justify-center w-auto h-[3rem] lg:h-[4rem]'>
            <Image
              src={src}
              alt={name}
              width={50}
              height={50}
              className='w-auto h-full'
            />
          </div>
          <span className='text-white text-center text-[0.8rem] lg:text-[1rem] mt-[10px] tracking-[0.1rem]'>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IconBar;
