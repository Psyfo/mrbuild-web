import React from "react";

// Replace with actual icons
const IconBar = () => {
  // Array of image sources and names for your icons
  const iconData = [
    { src: '/images/header/icon_electrical.png', name: 'Electrical' },
    { src: '/images/header/icon_plumbing.png', name: 'Plumbing' },
    { src: '/images/header/icon_tools.png', name: 'Tools' },
    {
      src: '/images/header/icon_building-material.png',
      name: 'Building Material',
    },
    { src: '/images/header/icon_paint.png', name: 'Paint' },
    { src: '/images/header/icon_doors.png', name: 'Wrapped Doors' },
    { src: '/images/header/icon_cutting.png', name: 'Edging & Cutting' },
    { src: '/images/header/icon_diy.png', name: 'DIY' },
  ];

  return (
    <div
      className='box-border grid grid-cols-4 lg:grid-cols-8 gap-y-4 items-center bg-mbRed w-[95vw] px-[3.125rem] py-[1rem] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform z-10 rounded-2xl lg:rounded-full'
      style={{ gridAutoRows: 'minmax(0, auto)' }}
    >
      {iconData.map(({ src, name }, idx) => (
        <div key={idx} className='flex flex-col items-center min-h-[4rem]'>
          <div className='flex items-center justify-center w-[2rem] lg:w-[3.2rem] h-[2rem] lg:h-[3.2rem]'>
            <img src={src} alt={name} className='h-full' />
          </div>
          <span className='text-white text-center text-[0.6rem] lg:text-[0.8rem] mt-[10px] tracking-[0.08rem] flex justify-center'>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IconBar;
