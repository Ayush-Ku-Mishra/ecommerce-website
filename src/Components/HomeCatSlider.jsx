import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/category/get-categories");
        const data = await response.json();

        if (data.success) {
          const rootCategories = data.data.filter(
            (category) => !category.parentId
          );
          setCategories(rootCategories);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="border">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border">
        <div className="flex justify-center items-center p-8 text-red-500">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const getCategoryImage = (category) => {
    if (category.images && category.images.length > 0) {
      const imageUrl = category.images[0];
      if (imageUrl.includes("cloudinary.com")) {
        return imageUrl.replace(
          "/upload/",
          "/upload/w_96,h_96,c_fill,f_auto,q_auto/"
        );
      }
      return imageUrl;
    }
    return "https://via.placeholder.com/96x96?text=No+Image";
  };

  const getCategoryUrl = (categoryName) => {
    return `/${categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")}?category=${categoryName.toLowerCase()}`;
  };

  return (
    <div className="border max-w-full overflow-x-hidden">
      <Swiper
        slidesPerView={7}
        spaceBetween={10}
        modules={[Navigation]}
        className="mySwiper m-4"
        breakpoints={{
          320: { slidesPerView: 4, spaceBetween: 10 },
          480: { slidesPerView: 3, spaceBetween: 10 },
          640: { slidesPerView: 4, spaceBetween: 10 },
          768: { slidesPerView: 5, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 },
          1280: { slidesPerView: 7, spaceBetween: 10 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <Link
              to={getCategoryUrl(category.name)}
              className="flex flex-col items-center justify-center group"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-md overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 group-hover:shadow-lg">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/96x96?text=No+Image";
                  }}
                />
              </div>

              <p className="mt-3 text-center text-sm font-medium group-hover:text-blue-600 transition-colors duration-200 break-words">
                {category.name}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {categories.length === 0 && !loading && (
        <div className="flex justify-center items-center p-8 text-gray-500">
          <span>No categories available</span>
        </div>
      )}
    </div>
  );
};

export default HomeCatSlider;
