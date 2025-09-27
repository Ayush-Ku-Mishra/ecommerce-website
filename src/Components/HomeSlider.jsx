import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { HomeSliderSkeleton } from "../Skeletons/HomeSliderSkeleton";

const HomeSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/slider/all`
      );

      if (data.success && data.sliders) {
        setSliders(data.sliders);
        // toast.success("Sliders loaded successfully");
      } else {
        toast.error(data.message || "Failed to load sliders");
      }
    } catch (error) {
      toast.error(
        `Error loading sliders: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  if (loading) {
    return <HomeSliderSkeleton />;
  }

  return (
    <div className="w-full py-2 mx-auto bg-[#fff0f5]">
      <div className="w-full">
        <Swiper
          spaceBetween={0}
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          className="sliderHome"
        >
          {sliders.length > 0 ? (
            sliders.map((slider, index) => (
              <SwiperSlide key={slider._id}>
                <div className="w-full h-[140px] sm:h-[280px] md:h-[360px]">
                  <img
                    src={slider.imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No sliders available
            </div>
          )}
        </Swiper>
      </div>

      {/* Features section */}
      <div className="flex items-center justify-center gap-10 border mt-2 p-4 bg-white border-red-300 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <img
            src="https://www.meesho.com/assets/Icons/returns.svg"
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>7 Days Easy Return</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <img
            src="https://www.meesho.com/assets/Icons/cod.svg"
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>Cash on Delivery</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <img
            src="https://www.meesho.com/assets/Icons/lowest-price.svg"
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>Lowest Prices</span>
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
