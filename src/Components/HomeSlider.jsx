import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


import { Autoplay } from 'swiper/modules';

const HomeSlider = () => {
  return (
    <div className="w-full py-2 mx-auto bg-[#fff0f5]">
        <div className="w-full">
            <Swiper
                spaceBetween={0}
                modules={[Autoplay]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                className="sliderHome">
                {[
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://i.postimg.cc/9Mh6bg2W/canva-9-EPx6fu8jq-Y.jpg",
                "https://images.meesho.com/images/marketing/1746425994914.webp",
                "https://serviceapi.spicezgold.com/download/1751685183248_NewProject(6).jpg",
                "https://i.postimg.cc/CLBcZHyJ/canva-I0v7-Yqr-BXh8.jpg"
                ].map((src, index) => (
                <SwiperSlide key={index}>
                    <div className="w-full h-[360px] object-cover">
                    <img
                        src={src}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                    </div>
                </SwiperSlide>
                ))}
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
