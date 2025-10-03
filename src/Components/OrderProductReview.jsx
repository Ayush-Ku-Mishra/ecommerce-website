import React, { useState, useEffect } from "react";
import { FaStar, FaImage, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const OrderProductReview = ({ product, orderId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB like Flipkart
  const MAX_TITLE_LENGTH = 100;
  const MAX_TEXT_LENGTH = 1000;

  useEffect(() => {
    checkExistingReview();
  }, [product.id, orderId]);

  const checkExistingReview = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/product/${product.id}`,
        { credentials: "include" }
      );
      const data = await response.json();
      
      if (data.success && data.reviews) {
        const userReview = data.reviews.find(
          (review) => review.userId?._id && review.orderId === orderId
        );
        
        if (userReview) {
          setExistingReview(userReview);
          setRating(userReview.rating);
          setReviewTitle(userReview.title || "");
          setReviewText(userReview.text);
          setSelectedFiles(
            userReview.images?.map((img) => ({
              id: img.publicId,
              preview: img.url,
              url: img.url,
              publicId: img.publicId,
              isExisting: true,
            })) || []
          );
        }
      }
    } catch (error) {
      console.error("Error checking existing review:", error);
    }
  };

  const validateImageSize = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`Image ${file.name} exceeds 5MB limit`);
      return false;
    }
    return true;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter(validateImageSize);

    const newFiles = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeImage = async (id, isExisting, publicId) => {
    if (isExisting && existingReview) {
      // Delete from backend
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/reviews/${existingReview._id}/remove-image`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: selectedFiles.find((f) => f.id === id)?.url,
            }),
          }
        );

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        toast.success("Image removed successfully");
      } catch (error) {
        toast.error("Failed to remove image");
        return;
      }
    }

    setSelectedFiles((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview && !removed.isExisting) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (reviewTitle.length > MAX_TITLE_LENGTH) {
      toast.error(`Title must be under ${MAX_TITLE_LENGTH} characters`);
      return;
    }

    if (reviewText.length > MAX_TEXT_LENGTH) {
      toast.error(`Review must be under ${MAX_TEXT_LENGTH} characters`);
      return;
    }

    try {
      setSubmitting(true);

      // Upload new images only
      let uploadedImages = [];
      const newImages = selectedFiles.filter((f) => !f.isExisting);

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => {
          formData.append("images", file.file);
        });

        const uploadResponse = await fetch(
          `${API_BASE_URL}/api/v1/reviews/upload-images`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Failed to upload images");
        }
        uploadedImages = uploadData.images;
      }

      // Combine existing and new images
      const existingImages = selectedFiles
        .filter((f) => f.isExisting)
        .map((f) => ({ url: f.url, publicId: f.publicId }));
      const allImages = [...existingImages, ...uploadedImages];

      const reviewData = {
        productId: product.id,
        orderId,
        rating,
        title: reviewTitle.trim(),
        text: reviewText.trim(),
        images: allImages,
        isVerifiedPurchase: true,
      };

      const url = existingReview
        ? `${API_BASE_URL}/api/v1/reviews/${existingReview._id}`
        : `${API_BASE_URL}/api/v1/reviews`;
      const method = existingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          existingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        
        // Update existing review state
        setExistingReview(data.review);
        
        // Update selected files with new structure
        setSelectedFiles(
          data.review.images?.map((img) => ({
            id: img.publicId,
            preview: img.url,
            url: img.url,
            publicId: img.publicId,
            isExisting: true,
          })) || []
        );

        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-start gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl transition-colors ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => !existingReview && setHoverRating(star)}
                onMouseLeave={() => !existingReview && setHoverRating(0)}
                onClick={() => !existingReview && setRating(star)}
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Review Title (optional)"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            disabled={existingReview && !isEditMode}
          />

          <textarea
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 min-h-[100px]"
            disabled={existingReview && !isEditMode}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional) - Max 5 (5MB each)
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <div key={file.id} className="relative">
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  {(!existingReview || isEditMode) && (
                    <button
                      onClick={() =>
                        removeImage(file.id, file.isExisting, file.publicId)
                      }
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              ))}
              {selectedFiles.length < 5 && (!existingReview || isEditMode) && (
                <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                  <FaImage className="text-gray-400" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              )}
            </div>
          </div>

          {!existingReview || isEditMode ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? existingReview
                  ? "Updating..."
                  : "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Edit Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderProductReview;