import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';


import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeSliderV2 = () => {
  return (
    <div className='flex w-full h-full gap-4'>
      <div className='w-[70%] relative'>
        <Swiper
        spaceBetween={10}
        effect={'fade'}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Pagination, Autoplay]}
        loop={true} 
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="mySwiper w-full h-[400px] "
      >
        <SwiperSlide>
            <div className="relative w-full h-[400px] rounded-md overflow-hidden">
                {/* Banner Image */}
                <img
                src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg"
                alt="Main Banner"
                className="w-full h-full object-cover"
                />

                {/* Text Overlay */}
                <div className="absolute top-1/2 left-[55%] -translate-y-1/2 text-left">
                    <p className="text-gray-600 text-lg font-medium slide-in delay-100">
                        Big saving days sale
                    </p>

                    <h2 className="text-3xl font-bold leading-snug text-gray-700 mt-2 slide-in delay-200">
                        Buy New Trend Women <br />
                        Black Cotton Blend Top <br />
                        | top for women | <br />
                        women top...
                    </h2>

                    <p className="mt-4 text-gray-700 text-lg slide-in delay-300">
                        Starting At Only <span className="text-red-500 font-bold text-3xl ml-2">₹1,550.00</span>
                    </p>

                    <button className="mt-4 bg-red-500 hover:bg-black text-white px-5 py-2 rounded-md text-sm font-semibold transition slide-in delay-400">
                        <Link to="/">SHOP NOW</Link>
                    </button>
                </div>

            </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-[400px] rounded-md overflow-hidden">
                <img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" className='w-full h-full object-cover' alt="slide-2"/>

                <div className="absolute top-1/2 left-[55%] -translate-y-1/2 text-left">
                <p className="text-gray-600 text-lg font-medium slide-in delay-100">
                    Big saving days sale
                </p>

                <h2 className="text-3xl font-bold leading-snug text-gray-700 mt-2 slide-in delay-200">
                    Apple iPhone 13 128 GB, <br />
                    Pink
                </h2>

                <p className="mt-4 text-gray-700 text-lg slide-in delay-300">
                    Starting At Only <span className="text-red-500 font-bold text-3xl ml-2">₹35,500.00</span>
                </p>

                <button className="mt-4 bg-red-500 hover:bg-black text-white px-5 py-2 rounded-md text-sm font-semibold transition slide-in delay-400">
                    <Link to="/">SHOP NOW</Link>
                </button>
                </div>
          </div>
        </SwiperSlide>
      </Swiper>
      </div>

      <div className='w-[30%] flex flex-col gap-4 h-[400px]'>
        <div className='overflow-hidden rounded-md relative'>
             <img src="https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg" alt="slide-3" className='w-full h-full object-cover transition-all hover:scale-105'/>

             <div className='absolute top-3 right-14 flex flex-col'>
                <h3 className='text-lg font-medium text-gray-700'>Buy Men's<br/>Footwear with<br/>low price</h3>
                <p className='text-red-500 text-xl font-semibold mt-2'>₹1500</p>
                <Link to="/" className='mt-2 underline font-semibold text-gray-700 hover:text-red-500'>SHOP NOW</Link>
             </div>
        </div>
        <div className='overflow-hidden rounded-md relative'>
            <img src="https://serviceapi.spicezgold.com/download/1741664496923_1737020250515_New_Project_47.jpg" alt="slide-4" className='w-full h-full object-cover transition-all hover:scale-105'/>

            <div className='absolute top-10  flex flex-col'>
                <h3 className='text-lg font-medium text-gray-700 ml-8'>Buy Apple Iphone</h3>
                <p className='text-red-500 text-xl font-semibold mt-2 ml-4'>₹45000</p>
                <Link to="/" className='mt-2 ml-4 underline font-semibold text-gray-700 hover:text-red-500'>SHOP NOW</Link>
             </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSliderV2
