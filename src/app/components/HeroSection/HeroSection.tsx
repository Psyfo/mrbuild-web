import IconBar from './IconBar/IconBar';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      id='hero'
      className='w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative bg-[url("/images/header/mb_hero_bg.png")]'
    >
      {/* Hero Text Image */}
      <Image
        src='/images/header/logo_mb_red.svg'
        alt='Hero Text'
        width={800}
        height={600}
        className='max-w-full max-h-full object-contain w-[80%] md:w-[60%] lg:w-[50%]'
      ></Image>

      <IconBar />
    </section>
  );
}
