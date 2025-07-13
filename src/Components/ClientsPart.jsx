import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';

const testimonials = [
  {
    name: "Rashmi Ranjan",
    role: "Unit Manager",
    image: "/RashmiPhoto.jpg",
    feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    name: "Ayush Kumar Mishra",
    role: "Manager",
    image: "/MyPhoto.jpg",
    feedback: "Galley of type and scrambled it to make a type specimen book."
  },
  {
    name: "Jacob Goeckno",
    role: "Helper",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    feedback: "Letraset sheets containing Lorem with desktop publishing printer took a galley."
  }
];

const ClientsPart = () => {
  return (
    <div className='mt-10 border-t mx-16'>
      <div className='mt-6 text-center'>
        <h3 className='text-2xl font-semibold mb-6'>What Our Clients Say</h3>

        <div className='w-full flex justify-center'>
          <div className='w-[340px]'>
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              initialSlide={Math.floor(testimonials.length / 2)}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              modules={[EffectCoverflow]}
              className="mySwiper"
            >
              {testimonials.map((t, index) => (
                <SwiperSlide key={index}>
                  <div className='flex flex-col items-center text-center px-4 py-6 bg-white rounded-lg shadow-md'>
                    <img
                      src={t.image}
                      alt={t.name}
                      className='w-16 h-16 object-cover rounded-full mb-4'
                    />
                    <h4 className='font-semibold text-[16px]'>{t.name}</h4>
                    <p className='text-gray-500 text-[14px]'>{t.role}</p>
                    <p className='text-gray-600 text-[15px] mt-2'>{t.feedback}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsPart;
