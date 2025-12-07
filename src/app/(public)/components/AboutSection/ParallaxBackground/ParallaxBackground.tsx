import React from 'react';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const ParallaxBackground: React.FC = () => {
  return (
    <ParallaxProvider>
      <Parallax
        className='custom-classname'
        translateY={[-20, 20]} // Adjust this range for more/less parallax effect
      >
        <div className="absolute w-full h-full bg-[url('/images/about/mb_about_bg.png')] bg-cover bg-center bg-opacity-20" />
      </Parallax>
    </ParallaxProvider>
  );
};

export default ParallaxBackground;
