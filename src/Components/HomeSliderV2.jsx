import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeSliderV2 = () => {
  return (
    <div className='flex flex-col lg:flex-row w-full h-full gap-2 md:gap-4 px-2 md:px-0'>
      {/* Main Slider Section */}
      <div className='w-full lg:w-[70%] relative'>
        <Swiper
          spaceBetween={10}
          effect={'fade'}
          pagination={{
            clickable: true,
          }}
          modules={[EffectFade, Pagination, Autoplay]}
          loop={true} 
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="mySwiper w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
        >
          <SwiperSlide>
            <div className="relative w-full h-full rounded-md overflow-hidden">
              {/* Banner Image */}
              <img
                src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg"
                alt="Main Banner"
                className="w-full h-full object-cover"
              />

              {/* Text Overlay */}
              <div className="absolute top-1/2 left-[5%] sm:left-[10%] md:left-[45%] lg:left-[55%] -translate-y-1/2 text-left">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg font-medium slide-in delay-100">
                  Big saving days sale
                </p>

                <h2 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold leading-snug text-gray-700 mt-1 md:mt-2 slide-in delay-200">
                  Buy New Trend Women <br className="hidden sm:block" />
                  <span className="sm:hidden">Black Cotton Top</span>
                  <span className="hidden sm:inline">Black Cotton Blend Top</span> <br className="hidden md:block" />
                  <span className="hidden md:inline">| top for women |</span> <br className="hidden lg:block" />
                  <span className="hidden lg:inline">women top...</span>
                </h2>

                <p className="mt-2 md:mt-4 text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg slide-in delay-300">
                  Starting At Only <span className="text-red-500 font-bold text-sm sm:text-lg md:text-2xl lg:text-3xl ml-1 md:ml-2">₹1,550.00</span>
                </p>

                <button className="mt-2 md:mt-4 bg-red-500 hover:bg-black text-white px-3 md:px-5 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition slide-in delay-400">
                  <Link to="/">SHOP NOW</Link>
                </button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <img 
                src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" 
                className='w-full h-full object-cover' 
                alt="slide-2"
              />

              <div className="absolute top-1/2 left-[5%] sm:left-[10%] md:left-[45%] lg:left-[55%] -translate-y-1/2 text-left">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg font-medium slide-in delay-100">
                  Big saving days sale
                </p>

                <h2 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold leading-snug text-gray-700 mt-1 md:mt-2 slide-in delay-200">
                  Apple iPhone 13 128 GB, <br className="hidden sm:block" />
                  Pink
                </h2>

                <p className="mt-2 md:mt-4 text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg slide-in delay-300">
                  Starting At Only <span className="text-red-500 font-bold text-sm sm:text-lg md:text-2xl lg:text-3xl ml-1 md:ml-2">₹35,500.00</span>
                </p>

                <button className="mt-2 md:mt-4 bg-red-500 hover:bg-black text-white px-3 md:px-5 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition slide-in delay-400">
                  <Link to="/">SHOP NOW</Link>
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Side Banners Section */}
      <div className='w-full lg:w-[30%] flex flex-row lg:flex-col gap-2 md:gap-4 h-[200px] sm:h-[220px] md:h-[300px] lg:h-[400px]'>
        {/* First Side Banner */}
        <div className='flex-1 lg:flex-none lg:h-[48%] overflow-hidden rounded-md relative'>
          <img 
            src="https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg" 
            alt="slide-3" 
            className='w-full h-full object-cover transition-all hover:scale-105'
          />

          <div className='absolute top-2 sm:top-3 right-2 sm:right-4 md:right-8 lg:right-14 flex flex-col'>
            <h3 className='text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 leading-tight'>
              Buy Men's<br/>
              Footwear with<br className="hidden sm:block"/>
              <span className="sm:hidden">low price</span>
              <span className="hidden sm:inline">low price</span>
            </h3>
            <p className='text-red-500 text-sm sm:text-base md:text-lg lg:text-xl font-semibold mt-1 md:mt-2'>₹1500</p>
            <Link to="/" className='mt-1 md:mt-2 underline font-semibold text-xs sm:text-sm text-gray-700 hover:text-red-500'>
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Second Side Banner */}
        <div className='flex-1 lg:flex-none lg:h-[48%] overflow-hidden rounded-md relative'>
          <img 
            src="https://serviceapi.spicezgold.com/download/1741664496923_1737020250515_New_Project_47.jpg" 
            alt="slide-4" 
            className='w-full h-full object-cover transition-all hover:scale-105'
          />

          <div className='absolute top-4 sm:top-6 md:top-8 lg:top-10 left-2 sm:left-4 md:left-6 lg:left-8 flex flex-col'>
            <h3 className='text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700'>Buy Apple Iphone</h3>
            <p className='text-red-500 text-sm sm:text-base md:text-lg lg:text-xl font-semibold mt-1 md:mt-2'>₹45000</p>
            <Link to="/" className='mt-1 md:mt-2 underline font-semibold text-xs sm:text-sm text-gray-700 hover:text-red-500'>
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSliderV2