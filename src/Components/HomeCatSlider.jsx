import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCatSlider = () => {
  return (
    <div className='border'>

      <div className=''>

        <Swiper slidesPerView={7} spaceBetween={10} modules={[Navigation]} className="mySwiper m-4">

        <SwiperSlide>
            <Link to="/fashion?category=fashion" className='flex flex-col items-center justify-center'>
                <img src="https://rukminim2.flixcart.com/fk-p-flap/128/128/image/ec2982e5564fe07c.png?q=100" alt="" className="transition-transform duration-300 ease-in-out hover:-translate-y-1"/>
                <p>Fashion</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/electronics?category=electronics" className='flex flex-col items-center justify-center '>
                <img src="https://rukminim2.flixcart.com/fk-p-flap/128/128/image/4d6b13d5a0e0724a.png?q=100" alt="" className="transition-transform duration-300 ease-in-out hover:-translate-y-1"/>
                <p>Electronics</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/bags?category=bags" className='flex flex-col items-center justify-center '>
                <img src="https://png.pngtree.com/background/20230614/original/pngtree-women-with-leather-bags-on-a-wooden-table-picture-image_3489477.jpg" alt="" className='w-24 h-24 mt-4 rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1'/>
                <p className='mt-3'>Bags</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/footwear?category=footwear" className='flex flex-col items-center justify-center '>
                <img src="https://jide-imgs.obs.myhuaweicloud.com/A9CC93" alt="" className='w-24 h-24 mt-4 rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1'/>
                <p className='mt-3'>Footwear</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/groceries?category=groceries" className='flex flex-col items-center justify-center '>
                <img src="https://rukminim2.flixcart.com/fk-p-flap/128/128/image/2ebb95ec20eae8f1.png?q=100" alt="" className="transition-transform duration-300 ease-in-out hover:-translate-y-1"/>
                <p>Groceries</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/beauty?category=beauty" className='flex flex-col items-center justify-center '>
                <img src="https://img.freepik.com/premium-photo/beauty-products-with-pink-flowers-soft-pink-background-cosmetic-skincare-products_656098-652.jpg?w=2000" alt="" className='w-24 h-24 mt-4 rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1'/>
                <p className='mt-3'>Beauty</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/furnitures?category=furnitures" className='flex flex-col items-center justify-center '>
                <img src="https://rukminim2.flixcart.com/fk-p-flap/128/128/image/cddd92e134ba3ea9.png?q=100" alt="" className="transition-transform duration-300 ease-in-out hover:-translate-y-1"/>
                <p>Furnitures</p>
            </Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/jewellery?category=jewellery" className='flex flex-col items-center justify-center '>
                <img src="https://3.bp.blogspot.com/-fEzQaq54bTY/VI7FgbwbxnI/AAAAAAAAOjc/ALOxif7m5SM/s1600/1.jpg" alt="" className='w-24 h-24 mt-4 rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1'/>
                <p className='mt-3'>Jewellery</p>
            </Link>
        </SwiperSlide>
      </Swiper>

      </div>

    </div>
  )
}

export default HomeCatSlider
