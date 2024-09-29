import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// import { useEffect, useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

const ServicesSlider = () => {
  const services = [
    {
      imageUrl: '/images/services/services_building-materials.png',
      heading: 'Building & Materials',
      text: 'From foundation to finish, we supply high-quality building materials to bring your construction projects to life. Our extensive range includes everything from structural components to finishing touches, ensuring you have the right materials for any job.',
      icon: '/images/services/icon_services_building-materials.svg',
    },
    {
      imageUrl: '/images/services/services_electrical.png',
      heading: 'Electricals',
      text: 'Power up your projects with our comprehensive electrical supplies. We offer a wide selection of cables, wiring, fixtures, and accessories to meet all your electrical needs, whether for residential, commercial, or industrial applications.',
      icon: '/images/services/icon_services_electrical.svg',
    },
    {
      imageUrl: '/images/services/services_plumbing.png',
      heading: 'Plumbing',
      text: 'Keep your systems running smoothly with our reliable plumbing products. From pipes and fittings to faucets and fixtures, we provide high-quality solutions for both routine repairs and new installations.',
      icon: '/images/services/icon_services_plumbing.svg',
    },
    {
      imageUrl: '/images/services/services_cutting.png',
      heading: 'Cutting & Edging',
      text: 'Achieve precision with our cutting and edging services. We offer expert cutting and finishing for a variety of materials, ensuring clean, accurate edges for a professional look in your projects.',
      icon: '/images/services/icon_services_cutting.svg',
    },
    {
      imageUrl: '/images/services/services_doors.png',
      heading: 'Wrapped Doors',
      text: 'Enhance the aesthetics and durability of your doors with our wrap door services. We provide high-quality wrapping options that protect and personalize your doors, adding a touch of style and longevity.',
      icon: '/images/services/icon_services_doors.svg',
    },
    {
      imageUrl: '/images/services/services_paint.png',
      heading: 'Paint',
      text: 'Transform any space with our extensive range of paints and coatings. Whether you’re looking for interior or exterior solutions, our products deliver exceptional color and finish, helping you achieve the perfect look for any project.',
      icon: '/images/services/icon_services_paint.svg',
    },
    {
      imageUrl: '/images/services/services_tools.png',
      heading: 'Tools',
      text: 'Equip yourself with our top-of-the-line tools designed for performance and durability. From hand tools to power tools, we offer a comprehensive selection to tackle any task with confidence and efficiency.',
      icon: '/images/services/icon_services_tools.svg',
    },
    {
      imageUrl: '/images/services/services_diy.png',
      heading: 'DIY',
      text: 'Empower your creativity with our DIY supplies and resources. We provide everything you need for your do-it-yourself projects, from materials and tools to expert advice, making it easy to complete your projects with a professional touch.',
      icon: '/images/services/icon_services_diy.svg',
    },
  ];

  //   const swiperRef = useRef<any>(null);

  //   useEffect(() => {
  //     if (swiperRef.current && swiperRef.current.swiper) {
  //       swiperRef.current.swiper.params.navigation.prevEl = '.services-prev';
  //       swiperRef.current.swiper.params.navigation.nextEl = '.services-next';
  //       swiperRef.current.swiper.navigation.init();
  //       swiperRef.current.swiper.navigation.update();
  //     }
  //   }, []);

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      }}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: '.services-next, #services-next',
        prevEl: '.services-prev, #services-prev',
      }}
      loop
      className=''
      onSlideChange={() => {}}
    >
      {services.map((service, index) => (
        <SwiperSlide key={index} className=''>
          <div className=' bg-mbRed rounded-3xl shadow-md overflow-hidden object-contain'>
            <Image
              src={service.imageUrl}
              alt={service.heading}
              width={100}
              height={120}
              quality={100}
              unoptimized
              className='w-full h-auto mb-4'
            />
            <h3 className='font-aleo font-medium text-[1.2rem] lg:text-[2.1rem] text-white mx-4 mb-2'>
              {service.heading}
            </h3>
            <p className='h-[120px] overflow-y-auto font-dinot text-[14px] lg:text-[1rem] text-white mx-4 mb-8'>
              {service.text}
            </p>
            <Image
              src={service.icon}
              alt={service.heading}
              height={69}
              width={69}
              className='absolute top-[40px] right-[60px] w-[3rem] lg:w-[4.3rem] h-auto'
            />
          </div>
        </SwiperSlide>
      ))}
      <div className='lg:absolute top-[2rem] right-[2rem] flex mt-[2rem] gap-[2rem]'>
        <Image
          src='/images/services/arrow_left.svg'
          alt='Left arrow'
          width={20}
          height={20}
          className='services-prev w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
        />
        <Image
          src='/images/services/arrow_right.svg'
          alt='Right arrow'
          width={20}
          height={20}
          className='services-next w-[50px] lg:w-[90px] h-[50px] lg:h-[90px]'
        />
      </div>
    </Swiper>
  );
};

export default ServicesSlider;
