import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';

const HomeSlider = () => {
  return (
    <div className="w-full py-2 mx-auto bg-[#fff0f5]">
        <div className='max-w-6xl mx-auto'>
            <Swiper spaceBetween={10} navigation={true} modules={[Navigation, Autoplay]} autoplay={{ delay: 2500, disableOnInteraction: false }} loop={true} className="sliderHome ">
        <SwiperSlide>
            <img src="https://serviceapi.spicezgold.com/download/1751685200593_1721277298204_banner.jpg" alt="Banner 1" className="w-full"/>
        </SwiperSlide>
        <SwiperSlide>
            <div className='rounded-[20px] overflow-hidden'>
                <img src="https://serviceapi.spicezgold.com/download/1751685183248_NewProject(6).jpg" alt="Banner 2" className='w-full'/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className='rounded-[20px] overflow-hidden'>
                <img src="https://serviceapi.spicezgold.com/download/1751685130717_NewProject(8).jpg" alt="Banner 3" className='w-full'/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className='rounded-[20px] overflow-hidden'>
                <img src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg" alt="Banner 4" className='w-full'/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
           <div className='rounded-[20px] overflow-hidden'>
             <img src="https://serviceapi.spicezgold.com/download/1751685164864_NewProject(10).jpg" alt="Banner 5" className='w-full'/>
           </div>
        </SwiperSlide>
      </Swiper>
        </div>

        <div className='flex items-center justify-center gap-10 border mt-2 p-2 bg-white border-red-300 rounded-lg '>

        <div className='flex items-center justify-center gap-2'>
            <img src="https://www.meesho.com/assets/Icons/returns.svg" alt="" className='w-5 h-5'/>
            <span>7 Days Easy Return</span>
        </div>
        <div className='flex items-center justify-center gap-2'>
            <img src="https://www.meesho.com/assets/Icons/cod.svg" alt="" className='w-5 h-5'/>
            <span>Cash on Delivery</span>
        </div>
        <div className='flex items-center justify-center gap-2'>
            <img src="https://www.meesho.com/assets/Icons/lowest-price.svg" alt="" className='w-5 h-5'/>
            <span>Lowest Prices</span>
        </div>
        
       </div>


    </div>
  )
}

export default HomeSlider
