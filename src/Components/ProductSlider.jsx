import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { MdZoomOutMap } from "react-icons/md";
import { VscGitCompare } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { products } from '../data/productItems.js';


const ProductSlider = () => {
  const popularProducts = products.filter(item => item.category === "popular");
    

  return (
    <div>

      <div>
      <Swiper 
      slidesPerView={6} 
      navigation={true} 
      spaceBetween={10} 
      modules={[Navigation]} 
      className="mySwiper m-4">

       
  {popularProducts.map((product) => (
    <SwiperSlide key={product.id}>
      <div className="w-full shadow-md">
        <div className="w-full h-48 overflow-hidden rounded-md relative group">
          <Link to={`/product/${product.id}`}>
            <div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-top object-cover"
              />
              {product.images[1] && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} hover`}
                  className="w-full h-full top-0 left-0 object-top object-cover absolute opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:scale-100"
                />
              )}
            </div>
          </Link>

          <span className='flex items-center absolute z-50 top-[10px] left-[10px] bg-red-500 text-white rounded-md'>
            {product.discount}
          </span>

          <div className='popularProducts absolute top-[-200px] right-[5px] z-50 flex flex-col items-center gap-2 w-[50px] group-hover:top-[15px] transition-all duration-500 opacity-0 group-hover:opacity-100'>
            <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-red-500 hover:text-white transition group'>
              <MdZoomOutMap className='text-[22px] !text-black group-hover:text-white transition' />
            </Button>

            <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-red-500 hover:text-white transition group'>
              <VscGitCompare className='text-[22px] !text-black group-hover:text-white transition' />
            </Button>

            <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-red-500 hover:text-white transition group'>
              <FaRegHeart className='text-[22px] !text-black group-hover:text-white transition' />
            </Button>
          </div>
        </div>

        <div className="p-2 shadow-md">
          <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
            <Link to={`/product/${product.id}`} className="hover:text-pink-600 transition">{product.brand}</Link>
          </h6>

          <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[20px] line-clamp-1">
            <Link to={`/product/${product.id}`} className="hover:text-pink-600 transition">
              {product.name}
            </Link>
          </h3>

          <Rating name="size-small" defaultValue={product.rating} size="small" readOnly />

          <div className='flex items-center justify-between'>
            <span className='line-through text-gray-500 font-[16px]'>₹{product.originalPrice.toLocaleString()}</span>
            <span className='text-red-500 font-[600]'>₹{product.discountedPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </SwiperSlide>
  ))}

      </Swiper>
      </div>
        
    </div>
  )
}

export default ProductSlider
