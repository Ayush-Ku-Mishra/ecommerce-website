import React, { useState, useEffect } from "react";
import { FaStar, FaThumbsUp, FaThumbsDown, FaImage } from "react-icons/fa";
import { Dialog } from "@mui/material";
import toast from "react-hot-toast";
import { FaUser, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalInfo, setShowModalInfo] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });
  const [imageModal, setImageModal] = useState({
    open: false,
    images: [],
    currentIndex: 0,
    review: null,
  });
  const [showReviewText, setShowReviewText] = useState({});
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [visibleImages, setVisibleImages] = useState(6);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "just now";
  };

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    console.log("ProductId received:", productId);
    if (productId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log("Fetching reviews for product:", productId);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/product/${productId}`
      );
      const data = await response.json();
      console.log("Reviews API response:", data);

      if (data.success) {
        const reviewsArray = data.reviews || [];
        setReviews(reviewsArray);

        // If backend provides ratingStats, use it
        if (data.ratingStats && data.ratingStats.distribution) {
          setStats({
            averageRating: data.ratingStats.averageRating || 0,
            totalReviews: data.ratingStats.totalReviews || 0,
            ratingDistribution: data.ratingStats.distribution || {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            },
          });
        } else {
          // Calculate stats from reviews array if backend doesn't provide them
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          let totalRating = 0;

          reviewsArray.forEach((review) => {
            const rating = review.rating;
            if (rating >= 1 && rating <= 5) {
              distribution[rating] = (distribution[rating] || 0) + 1;
              totalRating += rating;
            }
          });

          const avgRating =
            reviewsArray.length > 0 ? totalRating / reviewsArray.length : 0;

          setStats({
            averageRating: avgRating,
            totalReviews: reviewsArray.length,
            ratingDistribution: distribution,
          });
        }
      } else {
        console.error("API Error:", data.message);
        setReviews([]);
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const allReviewImages = reviews.reduce((acc, review) => {
    const images =
      review.images?.map((img) => ({
        url: img.url || img,
        review: review,
      })) || [];
    return [...acc, ...images];
  }, []);

  const handleLikeDislike = async (reviewId, action) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/${reviewId}/${action}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      toast.error("Please login to rate reviews");
    }
  };

  const toggleReviewText = (reviewId) => {
    setShowReviewText((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent"></div>
        <p className="text-gray-600 font-medium">Loading reviews...</p>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load reviews</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 lg:rounded-xl rounded-t-xl shadow-lg overflow-hidden w-full max-w-full">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 md:p-6">
        <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5">
          Ratings & Reviews
        </h2>

        {stats.totalReviews > 0 ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* Average Rating */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 text-center w-full sm:w-auto sm:min-w-[160px]">
              <div className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`${
                      star <= Math.round(stats.averageRating)
                        ? "text-yellow-300"
                        : "text-white/30"
                    } w-4 h-4`}
                  />
                ))}
              </div>
              <div className="text-white/90 font-medium text-sm">
                {stats.totalReviews}{" "}
                {stats.totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full lg:max-w-md space-y-2 sm:space-y-2.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="flex items-center gap-1 min-w-[45px] sm:min-w-[50px]">
                      <span className="text-white font-medium text-sm">
                        {rating}
                      </span>
                      <FaStar className="text-yellow-300 w-3 h-3" />
                    </div>
                    <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white/90 font-medium min-w-[30px] sm:min-w-[35px] text-right text-sm">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10">
            <div className="text-white/40 mb-4">
              <FaStar size={48} className="mx-auto" />
            </div>
            <p className="text-white text-lg sm:text-xl font-semibold mb-2">
              No reviews yet
            </p>
            <p className="text-white/80 text-sm">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>

      {/* Customer Photos Section */}
      {allReviewImages.length > 0 && (
        <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <FaImage className="text-blue-600" />
            Customer Photos ({allReviewImages.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {allReviewImages.slice(0, visibleImages).map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() =>
                  setImageModal({
                    open: true,
                    images: allReviewImages,
                    currentIndex: index,
                    review: image.review,
                  })
                }
              >
                <img
                  src={image.url}
                  alt="Review"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          {allReviewImages.length > visibleImages && (
            <button
              onClick={() => setVisibleImages((prev) => prev + 6)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              View More Photos
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <FaUser className="text-white" size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm md:text-base break-words">
                    {review.isAnonymous
                      ? "Anonymous"
                      : review.userId?.name || "User"}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium border border-green-200">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }
                        size={16}
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-gray-900 mt-3 text-sm md:text-base break-words">
                    {review.title}
                  </h4>
                )}

                <p className="text-gray-700 mt-2 text-sm md:text-base leading-relaxed break-words">
                  {showReviewText[review._id]
                    ? review.text
                    : `${review.text.slice(0, 150)}${
                        review.text.length > 150 ? "..." : ""
                      }`}
                  {review.text.length > 150 && (
                    <button
                      onClick={() => toggleReviewText(review._id)}
                      className="text-blue-600 hover:text-blue-800 ml-1 text-sm font-semibold underline"
                    >
                      {showReviewText[review._id] ? "Show Less" : "Read More"}
                    </button>
                  )}
                </p>

                {/* Review Images */}
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          setImageModal({
                            open: true,
                            images: review.images,
                            currentIndex: index,
                            review,
                          })
                        }
                        className="relative flex-shrink-0 cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={image.url}
                          alt={`Review ${index + 1}`}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 md:gap-6 mt-4">
                  <button
                    onClick={() => handleLikeDislike(review._id, "like")}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <FaThumbsUp size={16} className="md:text-lg" />
                    <span className="text-sm md:text-base">
                      {review.likes?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => handleLikeDislike(review._id, "dislike")}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
                  >
                    <FaThumbsDown size={16} className="md:text-lg" />
                    <span className="text-sm md:text-base">
                      {review.dislikes?.length || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {reviews.length > visibleReviews && (
          <button
            onClick={() => setVisibleReviews((prev) => prev + 3)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            Load More Reviews
          </button>
        )}
      </div>

      {/* Image Modal - Keep Original MUI Design */}
      <Dialog
        open={imageModal.open}
        onClose={() =>
          setImageModal({
            open: false,
            images: [],
            currentIndex: 0,
            review: null,
          })
        }
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            margin: 0,
          },
        }}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={() =>
              setImageModal({
                open: false,
                images: [],
                currentIndex: 0,
                review: null,
              })
            }
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
          >
            <FaTimes size={24} />
          </button>

          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
            onClick={() => setShowModalInfo(!showModalInfo)}
          >
            <Swiper
              modules={[Pagination, Zoom]}
              pagination={{ type: "fraction" }}
              zoom={{ maxRatio: 3, toggle: true }}
              initialSlide={imageModal.currentIndex}
              className="w-full h-full"
            >
              {imageModal.images.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="flex items-center justify-center"
                >
                  <div className="swiper-zoom-container flex items-center justify-center w-full h-full">
                    <img
                      src={image.url}
                      alt={`Review image ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {imageModal.review && showModalInfo && (
            <div
              className="absolute bottom-0 left-0 right-0 z-50 bg-black/75 backdrop-blur-sm p-4 md:p-6 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 md:gap-4 max-w-4xl mx-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-white" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-white text-sm md:text-base">
                      {imageModal.review.isAnonymous
                        ? "Anonymous"
                        : imageModal.review.userId?.name || "User"}
                    </span>
                    {imageModal.review.isVerifiedPurchase && (
                      <span className="bg-green-500/30 text-green-300 text-xs px-2 py-0.5 rounded-full font-medium border border-green-400/40">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= imageModal.review.rating
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }
                          size={14}
                        />
                      ))}
                    </div>
                    <span className="text-xs md:text-sm text-white/70">
                      {getTimeAgo(imageModal.review.createdAt)}
                    </span>
                  </div>

                  {imageModal.review.title && (
                    <h4 className="font-semibold text-white mb-2 text-sm md:text-base">
                      {imageModal.review.title}
                    </h4>
                  )}

                  <p className="text-white/90 text-xs md:text-sm leading-relaxed mb-3 whitespace-normal break-words">
                    {imageModal.review.text}
                  </p>

                  <div className="flex items-center gap-4 md:gap-6 pt-2 border-t border-white/10">
                    <button
                      onClick={() =>
                        handleLikeDislike(imageModal.review._id, "like")
                      }
                      className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-colors"
                    >
                      <FaThumbsUp size={14} />
                      <span className="text-xs md:text-sm">
                        {imageModal.review.likes?.length || 0}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        handleLikeDislike(imageModal.review._id, "dislike")
                      }
                      className="flex items-center gap-2 text-white/70 hover:text-red-400 transition-colors"
                    >
                      <FaThumbsDown size={14} />
                      <span className="text-xs md:text-sm">
                        {imageModal.review.dislikes?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ProductReviews;
