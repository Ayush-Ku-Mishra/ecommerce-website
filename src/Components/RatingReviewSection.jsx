import React, { useEffect, useState } from "react";
import { Dialog, Backdrop, CircularProgress } from "@mui/material";
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaImage,
  FaUser,
  FaFilter,
  FaSort,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { toast } from "react-toastify";
import { useContext } from "react";
import { Context } from "../main";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  reviewTitle,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      style: {
        borderRadius: "12px",
        padding: "24px",
      },
    }}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Delete Review</h3>
        <button
          onClick={onClose}
          disabled={loading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-gray-600">
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
        {reviewTitle && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700">Review: "{reviewTitle}"</p>
          </div>
        )}
        <p className="text-sm text-gray-500">
          All associated images will also be permanently deleted from our
          servers.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading && (
            <CircularProgress size={16} style={{ color: "#ffffff" }} />
          )}
          {loading ? "Deleting..." : "Delete Review"}
        </button>
      </div>
    </div>
  </Dialog>
);

// Report Modal Component
const ReportModal = ({
  open,
  onClose,
  onSubmit,
  reportReason,
  setReportReason,
  customReason,
  setCustomReason,
}) => {
  const reportReasons = [
    { value: "spam", label: "Spam or promotional content" },
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "fake", label: "Fake or misleading review" },
    { value: "offensive", label: "Offensive or abusive language" },
    { value: "other", label: "Other (please specify)" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "24px",
        },
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Report Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Please select the reason for reporting this review:
        </p>

        <div className="space-y-3">
          {reportReasons.map((reason) => (
            <label
              key={reason.value}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="reportReason"
                value={reason.value}
                checked={reportReason === reason.value}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">{reason.label}</span>
            </label>
          ))}
        </div>

        {reportReason === "other" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please specify your reason:
            </label>
            <textarea
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please describe your concern..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              maxLength={500}
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {customReason.length}/500 characters
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={
              !reportReason ||
              (reportReason === "other" && !customReason.trim())
            }
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Report
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const RatingReviewSection = ({ productId = "sample-product" }) => {
  // Form states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(true);

  // Review data states
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  // Filter and sort states
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    reviewId: null,
    reviewTitle: "",
    loading: false,
  });
  const [reportModal, setReportModal] = useState({
    open: false,
    reviewId: null,
  });
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [imageModal, setImageModal] = useState({
    open: false,
    images: [],
    currentIndex: 0,
  });

  // Edit states
  const [editingReview, setEditingReview] = useState(null);
  const { user: currentUser, isAuthenticated } = useContext(Context);

  // API configuration
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getHeaders = (includeAuth = true) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  };

  // Load reviews when component mounts or filters change
  useEffect(() => {
    loadReviews(true);
  }, [productId, sortBy, filterRating]);

  // Load reviews function
  const loadReviews = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setReviews([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const page = reset ? 1 : currentPage + 1;
      const limit = reset ? 5 : 10;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        ...(filterRating > 0 && { rating: filterRating.toString() }),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/product/${productId}?${params}`,
        {
          method: "GET",
          headers: getHeaders(false),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();

      if (data.success) {
        const newReviews = data.reviews || [];

        if (reset) {
          setReviews(newReviews);
          setCurrentPage(1);
        } else {
          setReviews((prev) => [...prev, ...newReviews]);
          setCurrentPage(page);
        }

        setTotalPages(data.totalPages || 1);
        setRatingStats(data.ratingStats || null);
        setHasMoreReviews(
          newReviews.length === limit && page < (data.totalPages || 1)
        );
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more reviews
  const loadMoreReviews = () => {
    if (!loadingMore && hasMoreReviews) {
      loadReviews(false);
    }
  };

  // Calculate statistics
  const averageRating =
    ratingStats?.averageRating ||
    (reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0);

  const getRatingDistribution = () => {
    if (ratingStats?.distribution) {
      return ratingStats.distribution;
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Image handling functions
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.info("Maximum 5 images allowed");
      return;
    }

    const newFiles = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeSelectedImage = async (id) => {
    const imageToDelete = selectedFiles.find((img) => img.id === id);

    if (!imageToDelete) return;

    if (imageToDelete.url && !imageToDelete.isNew) {
      try {
        setDeletingImageId(id);

        if (!isAuthenticated || !currentUser) {
          toast.error("Please login to perform this action");
          return;
        }

        // Use originalUserId for ownership check
        const reviewOwner =
          editingReview?.originalUserId || editingReview?.userId;

        console.log("=== FRONTEND OWNERSHIP CHECK ===");
        console.log("Current user:", currentUser?._id);
        console.log("Review originalUserId:", editingReview?.originalUserId);
        console.log("Review userId:", editingReview?.userId);
        console.log("Review owner:", reviewOwner);
        console.log("Can edit:", reviewOwner === currentUser?._id);
        console.log("================================");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/reviews/${editingReview._id}/remove-image`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ imageUrl: imageToDelete.url }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to delete image from server"
          );
        }

        toast.success("Image deleted from server");
      } catch (error) {
        console.error("Error deleting image from server:", error);
        toast.error("Failed to delete image from server");
        setDeletingImageId(null);
        return;
      } finally {
        setDeletingImageId(null);
      }
    }

    // Remove from local state
    setSelectedFiles((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      if (imageToDelete.preview) {
        URL.revokeObjectURL(imageToDelete.preview);
      }
      return updated;
    });
  };

  const uploadImages = async (files) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    files.forEach((fileObj) => {
      formData.append("images", fileObj.file);
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/reviews/upload-images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload images");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.images;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error("Please provide a rating and review text");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      setSubmitting(true);

      const newFiles = selectedFiles.filter((file) => file.isNew && file.file);
      const existingImages = selectedFiles.filter(
        (file) => file.url && !file.isNew
      );

      let uploadedImages = [];

      if (newFiles.length > 0) {
        setUploading(true);
        uploadedImages = await uploadImages(newFiles);
      }

      const allImages = [
        ...existingImages.map((img) => ({
          url: img.url,
          publicId: img.publicId,
        })),
        ...uploadedImages,
      ];

      const reviewData = {
        productId,
        rating,
        title: reviewTitle.trim() || undefined,
        text: reviewText.trim(),
        images: allImages,
        isAnonymous,
        isVerifiedPurchase,
      };

      const endpoint = editingReview
        ? `${API_BASE_URL}/api/v1/reviews/${editingReview._id}`
        : `${API_BASE_URL}/api/v1/reviews/`;

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingReview ? "update" : "submit"} review`
        );
      }

      const data = await response.json();

      if (data.success) {
        newFiles.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });

        resetForm();
        await loadReviews(true);
        toast.success(
          `Review ${editingReview ? "updated" : "submitted"} successfully!`
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.message ||
          `Failed to ${
            editingReview ? "update" : "submit"
          } review. Please try again.`
      );
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setReviewTitle("");
    setSelectedFiles([]);
    setIsAnonymous(false);
    setUserName("");
    setEditingReview(null);
  };

  // Edit review functions
  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setReviewTitle(review.title || "");
    setReviewText(review.text);
    setIsAnonymous(review.isAnonymous);

    const existingImages = (review.images || []).map((img, index) => ({
      id: `existing-${index}-${Date.now()}`,
      url: img.url || img,
      publicId: img.publicId,
      isNew: false,
    }));

    setSelectedFiles(existingImages);
    document
      .querySelector(".bg-gray-50")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    resetForm();
  };

  // Delete review functions
  const openDeleteModal = (reviewId, reviewTitle = "") => {
    setDeleteModal({
      open: true,
      reviewId,
      reviewTitle,
      loading: false,
    });
  };

  const closeDeleteModal = () => {
    if (!deleteModal.loading) {
      setDeleteModal({
        open: false,
        reviewId: null,
        reviewTitle: "",
        loading: false,
      });
    }
  };

  const handleDeleteReview = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to delete reviews");
      return;
    }

    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));

      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/${deleteModal.reviewId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Review and all associated images deleted successfully");
        await loadReviews(true);
        closeDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(
        error.message || "Failed to delete review. Please try again."
      );
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Review interaction functions
  const handleHelpful = async (reviewId, isHelpful) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to rate reviews");
      return;
    }

    try {
      const endpoint = isHelpful ? "like" : "dislike";
      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/${reviewId}/${endpoint}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update review rating");
      }

      const data = await response.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((review) => {
            if (review._id === reviewId) {
              return {
                ...review,
                likes: Array(data.likesCount || 0).fill({ user: "dummy" }),
                dislikes: Array(data.dislikesCount || 0).fill({
                  user: "dummy",
                }),
                userInteraction: {
                  ...review.userInteraction,
                  isLiked: data.isLiked,
                  isDisliked: data.isDisliked,
                },
              };
            }
            return review;
          })
        );
      }
    } catch (error) {
      console.error("Error updating review rating:", error);
      toast.error(
        error.message || "Failed to update review rating. Please try again."
      );
    }
  };

  // Image gallery functions
  const openImageGallery = (images, startIndex = 0) => {
    const imageUrls = images.map((img) => img.url || img.preview || img);
    setImageModal({
      open: true,
      images: imageUrls,
      currentIndex: startIndex,
    });
  };

  const closeImageGallery = () => {
    setImageModal({ open: false, images: [], currentIndex: 0 });
  };

  const goToNextImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const goToPrevImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.images.length - 1
          : prev.currentIndex - 1,
    }));
  };

  const goToImage = (index) => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: index,
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!imageModal.open) return;

      if (event.key === "Escape") {
        closeImageGallery();
      } else if (event.key === "ArrowLeft") {
        goToPrevImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imageModal.open]);

  // Report functions
  const openReportModal = (reviewId) => {
    setReportModal({ open: true, reviewId });
    setReportReason("");
    setCustomReason("");
  };

  const closeReportModal = () => {
    setReportModal({ open: false, reviewId: null });
    setReportReason("");
    setCustomReason("");
  };

  const handleReportSubmission = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to report reviews");
      return;
    }

    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    if (reportReason === "other" && !customReason.trim()) {
      toast.error("Please provide a custom reason");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/reviews/${reportModal.reviewId}/report`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            reason:
              reportReason === "other" ? customReason.trim() : reportReason,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to report review");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Review reported successfully. Thank you for helping keep our community safe."
        );
        closeReportModal();
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error(
        error.message || "Failed to report review. Please try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white lg:rounded-2xl rounded-md shadow-xl overflow-hidden md:px-0">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Customer Reviews & Ratings
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-6 flex-wrap">
          {/* Left: 1 to 5 stars */}
          <div className="flex items-center gap-2">
            <div className="text-3xl md:text-4xl font-bold">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    className={`text-base md:text-lg ${
                      averageRating >= i ? "text-yellow-300" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm opacity-90">
                Based on {ratingStats?.totalReviews || reviews.length} reviews
              </div>
            </div>
          </div>

          {/* Right: 5 to 1 stars with bars */}
          <div className="flex-1 max-w-md w-full md:w-auto min-w-0">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star];
              const total = ratingStats?.totalReviews || reviews.length;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-6">{star}★</span>
                  <div className="flex-1 bg-white/20 rounded-full h-2 min-w-0">
                    <div
                      className="bg-yellow-300 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-1 md:p-6">
        {/* Write Review Section */}
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 flex-col md:flex-row gap-2 md:gap-0">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              {editingReview ? "Edit Review" : "Write a Review"}
            </h3>
            {editingReview && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-full md:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {!isAnonymous && (
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer text-2xl md:text-3xl transition-colors ${
                      (hoverRating || rating) >= i
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {rating > 0 && `(${rating} star${rating !== 1 ? "s" : ""})`}
                </span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Review title (optional)"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <textarea
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your detailed experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={2000}
            />
            <div className="text-sm text-gray-500 text-right">
              {reviewText.length}/2000 characters
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional) - Max 5 images
              </label>
              <div className="flex items-center gap-4 mb-3 flex-col md:flex-row">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors w-full md:w-auto justify-center md:justify-start">
                  <FaImage />
                  Choose Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {selectedFiles.length}/5 images selected
                </span>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {selectedFiles.map((img, index) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.preview || img.url}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImageGallery(selectedFiles, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(img.id)}
                        disabled={submitting || deletingImageId === img.id}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingImageId === img.id ? (
                          <CircularProgress
                            size={12}
                            style={{ color: "#ffffff" }}
                          />
                        ) : (
                          "×"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-wrap flex-col md:flex-row">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Post anonymously</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerifiedPurchase}
                  onChange={(e) => setIsVerifiedPurchase(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Verified purchase</span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto justify-center"
            >
              {submitting && <FaSpinner className="animate-spin" />}
              {uploading
                ? "Uploading images..."
                : submitting
                ? editingReview
                  ? "Updating..."
                  : "Submitting..."
                : editingReview
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-4 mb-6 flex-wrap flex-col md:flex-row">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FaSort className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">
              Loading reviews...
            </span>
          </div>
        )}

        {/* Reviews List */}
        {!loading && (
          <div className="space-y-4 md:space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="text-gray-400 text-4xl md:text-6xl mb-4">
                  <FaStar />
                </div>
                <p className="text-gray-500 text-base md:text-lg">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3 flex-col md:flex-row gap-3 md:gap-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
                          <span className="font-medium text-gray-800">
                            {review.isAnonymous
                              ? "Anonymous"
                              : review.userId?.name ||
                                review.userName ||
                                "Anonymous User"}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              ✓ Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1 flex-col md:flex-row items-start md:items-center">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  review.rating >= i
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(
                              review.createdAt || review.date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md p-2 transition-all duration-200"
                        title="Edit Review"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          openDeleteModal(review._id || review.id, review.title)
                        }
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md p-2 transition-all duration-200"
                        title="Delete Review"
                      >
                        <FaTrash size={16} />
                      </button>
                      <button
                        onClick={() => openReportModal(review._id || review.id)}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md p-2 transition-all duration-200"
                        title="Report Review"
                      >
                        <FaFlag size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">
                      {review.title}
                    </h4>
                  )}
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                    {review.text}
                  </p>

                  {/* Review Images with Navigation */}
                  {review.images && review.images.length > 0 && (
                    <div className="mb-4">
                      <div className="gap-3 flex-wrap grid grid-cols-4 md:flex md:gap-3">
                        {review.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url || img}
                              alt={`Review image ${index + 1}`}
                              className="w-full md:w-24 h-20 md:h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                openImageGallery(review.images, index)
                              }
                            />
                            {review.images.length > 1 && (
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-200">
                                <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black bg-opacity-60 px-2 py-1 rounded">
                                  {index + 1} of {review.images.length}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {review.images.length > 1 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Click any image to view gallery with navigation
                        </p>
                      )}
                    </div>
                  )}

                  {/* Review Response */}
                  {review.response && review.response.text && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 md:p-4 mb-4">
                      <div className="flex gap-2 mb-2 flex-col md:flex-row items-start md:items-center md:gap-2">
                        <span className="text-blue-700 text-sm md:text-base">
                          Response from{" "}
                          {review.response.role === "admin"
                            ? "Admin"
                            : "Seller"}
                        </span>
                        <span className="text-sm text-blue-600">
                          {new Date(
                            review.response.respondedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-blue-700">{review.response.text}</p>
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100 flex-col md:flex-row md:gap-4">
                    <button
                      onClick={() =>
                        handleHelpful(review._id || review.id, true)
                      }
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors justify-center md:justify-start ${
                        review.userInteraction?.isLiked
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaThumbsUp />
                      <span>Helpful ({review.likes?.length || 0})</span>
                    </button>

                    <button
                      onClick={() =>
                        handleHelpful(review._id || review.id, false)
                      }
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                        review.userInteraction?.isDisliked
                          ? "bg-red-100 text-red-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaThumbsDown />
                      <span>Not Helpful ({review.dislikes?.length || 0})</span>
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Load More Button */}
            {!loading && hasMoreReviews && (
              <div className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loadingMore && <FaSpinner className="animate-spin" />}
                  {loadingMore
                    ? "Loading more reviews..."
                    : "Load More Reviews"}
                </button>
              </div>
            )}

            {/* No More Reviews Message */}
            {!loading && !hasMoreReviews && reviews.length > 5 && (
              <div className="text-center mt-8">
                <p className="text-gray-500">
                  You've seen all reviews for this product
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteReview}
        loading={deleteModal.loading}
        reviewTitle={deleteModal.reviewTitle}
      />

      {/* Image Gallery Modal */}
      <Dialog
        open={imageModal.open}
        onClose={closeImageGallery}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "none",
            margin: 0,
            maxWidth: "100vw",
            maxHeight: "100vh",
          },
        }}
      >
        <div className="relative w-full h-full bg-white bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeImageGallery}
            className="absolute top-2 md:top-4 right-2 md:right-4 z-50 p-2 bg-gray-300 bg-opacity-50 text-black rounded-full hover:bg-opacity-70 transition-all"
          >
            <IoClose size={24} />
          </button>

          {imageModal.images.length === 0 && (
            <Backdrop
              open={true}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            >
              <CircularProgress style={{ color: "#ffffff" }} />
            </Backdrop>
          )}

          {imageModal.images.length > 0 && (
            <div className="flex items-center justify-center w-full h-full px-4 md:px-16">
              <img
                src={imageModal.images[imageModal.currentIndex]}
                alt={`Review image ${imageModal.currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {imageModal.images.length > 1 && (
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 md:gap-2 bg-black bg-opacity-50 p-1 md:p-2 rounded-lg max-w-[90vw] md:max-w-[80vw] overflow-x-auto">
              {imageModal.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-12 h-12 md:w-16 md:h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                    index === imageModal.currentIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          )}

          {imageModal.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              >
                <IoChevronBack size={24} />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              >
                <IoChevronForward size={24} />
              </button>
            </>
          )}

          {imageModal.images.length > 1 && (
            <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 md:px-3 py-1 rounded-full text-sm">
              {imageModal.currentIndex + 1} / {imageModal.images.length}
            </div>
          )}
        </div>
      </Dialog>

      {/* Report Modal */}
      <ReportModal
        open={reportModal.open}
        onClose={closeReportModal}
        onSubmit={handleReportSubmission}
        reportReason={reportReason}
        setReportReason={setReportReason}
        customReason={customReason}
        setCustomReason={setCustomReason}
      />
    </div>
  );
};

export default RatingReviewSection;
