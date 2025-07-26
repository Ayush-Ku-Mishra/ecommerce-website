import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingReviewSection = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`reviews-${productId}`);
    if (saved) setReviews(JSON.parse(saved));
  }, [productId]);

  // Handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) return alert("Please fill in all fields");

    const newReview = {
      id: Date.now(),
      rating,
      text: reviewText,
      image: image ? URL.createObjectURL(image) : null,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(updatedReviews));

    // Reset
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setImage(null);
  };

  return (
    <div className="mt-5 w-full md:w-[100%] mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ratings & Reviews</h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              className={`cursor-pointer text-2xl ${
                (hoverRating || rating) >= i ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i)}
            />
          ))}
        </div>

        <textarea
          rows="3"
          className="w-full border rounded p-2 mb-3 text-gray-800"
          placeholder="Share your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </form>

      {/* Display Reviews */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-t pt-4">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      review.rating >= i ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-800 mb-2">{review.text}</p>
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="w-32 h-32 object-cover rounded border"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingReviewSection;
