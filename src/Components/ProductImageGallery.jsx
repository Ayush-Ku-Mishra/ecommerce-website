import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaBolt, FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../main";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { 
  Modal, 
  Box, 
  Typography, 
  IconButton, 
  Slide, 
  Divider, 
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Fade,
  Paper
} from "@mui/material";
import { 
  Facebook, 
  Twitter, 
  WhatsApp, 
  LinkedIn, 
  ContentCopy, 
  Telegram,
  Close,
  Email,
  Link as LinkIcon
} from "@mui/icons-material";

const ProductImageGallery = ({
  product,
  selectedVariant,
  setSelectedVariant,
  selectedSize,
  isDeliverable,
  onOpenGallery,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const linkInputRef = useRef(null);
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [selectedImage, setSelectedImage] = useState(
    selectedVariant?.images?.[0] || ""
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageKey, setImageKey] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, updateCartCount, updateWishlistCount } =
    useContext(Context);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const isOutOfStock =
    selectedSize && (!selectedSize.inStock || selectedSize.stockQuantity === 0);
  const images = selectedVariant?.images || [];
  
  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setSelectedImage(selectedVariant?.images?.[0] || "");
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  useEffect(() => {
    setImageKey(Date.now());
  }, [selectedImage]);


  // Thumbnail click - only changes main image
  const handleImageClick = (img, index) => {
    if (img !== selectedImage) {
      setSelectedImage(img);
      setCurrentImageIndex(index);
      setImageKey(Date.now());
    }
  };

  const handleMouseMove = (e) => {
    if (isMobile) return; // Disable zoom on mobile

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const resetZoom = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  // Helper function to generate consistent product ID
  const generateStandardProductId = (variant, size) => {
    const baseProductId = variant.id.split("_")[0];
    return baseProductId;
  };

  useEffect(() => {
    if (!selectedVariant || !isAuthenticated) {
      setIsInWishlistState(false);
      return;
    }

    const checkWishlistStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const standardProductId = generateStandardProductId(
            selectedVariant,
            selectedSize
          );

          const isInWishlist = response.data.data.some(
            (item) => item.productId === standardProductId
          );
          setIsInWishlistState(isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [selectedVariant, selectedSize, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (
      hasSizes &&
      (!selectedSize.inStock || selectedSize.stockQuantity === 0)
    ) {
      toast.error("Selected size is out of stock.");
      return;
    }

    if (isDeliverable === null || isDeliverable === undefined) {
      toast.error("Please check estimated delivery first.");
      return;
    }

    if (!isDeliverable) {
      toast.error("This product is not deliverable to your location.");
      return;
    }

    try {
      const baseProductId = selectedVariant.id.split("_")[0];
      const standardVariantId = `${baseProductId}_${
        selectedVariant?.color || "default"
      }_${selectedSize?.size || "default"}`;

      const cartData = {
        productId: baseProductId,
        variantId: standardVariantId,
        quantity: 1,
        selectedSize: hasSizes ? selectedSize?.size : null,
        selectedColor: selectedVariant?.color,
        price: Math.round(
          selectedVariant.discountedPrice ?? product.discountedPrice
        ),
        originalPrice: Math.round(
          selectedVariant.originalPrice ?? product.originalPrice
        ),
        productName: product.name,
        productBrand: product.brand,
        productImage: selectedVariant.images?.[0] || product.images?.[0],
        discount: (
          selectedVariant.discount ??
          product.discount ??
          ""
        ).toString(),
      };

      await axios.post(`${API_BASE_URL}/api/v1/cart/createCart`, cartData, {
        withCredentials: true,
      });

      toast.success("Item added to cart!");
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 409) {
        toast.info("Item already in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (
      hasSizes &&
      (!selectedSize.inStock || selectedSize.stockQuantity === 0)
    ) {
      toast.error("Selected size is out of stock.");
      return;
    }

    if (isDeliverable === null || isDeliverable === undefined) {
      toast.error("Please check estimated delivery first.");
      return;
    }

    if (!isDeliverable) {
      toast.error("This product is not deliverable to your location.");
      return;
    }

    const buyNowItem = {
      id: `${selectedVariant.id.split("_")[0]}_${
        selectedVariant?.color || "default"
      }_${selectedSize?.size || "default"}`,
      title: product.name,
      brand: product.brand,
      price: Math.round(
        selectedVariant.discountedPrice ?? product.discountedPrice
      ),
      originalPrice: Math.round(
        selectedVariant.originalPrice ?? product.originalPrice
      ),
      quantity: 1,
      selectedSize: hasSizes ? selectedSize?.size : "default",
      image: selectedVariant.images?.[0] || product.images?.[0],
      discount: (selectedVariant.discount ?? product.discount ?? "").toString(),
      _id: `temp_${Date.now()}`,
      isBuyNow: true,
    };

    navigate("/checkout", {
      state: {
        buyNowItem: buyNowItem,
        isBuyNow: true,
      },
    });
  };

  if (!selectedVariant) return null;

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (!selectedVariant || !product) return;

    const standardProductId = generateStandardProductId(
      selectedVariant,
      selectedSize
    );

    try {
      if (isInWishlistState) {
        const wishlistResponse = await axios.get(
          `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
          {
            withCredentials: true,
          }
        );

        if (wishlistResponse.data.success) {
          const wishlistItem = wishlistResponse.data.data.find(
            (item) => item.productId === standardProductId
          );
          if (wishlistItem) {
            await axios.delete(
              `${API_BASE_URL}/api/v1/wishlist/deleteWishlist/${wishlistItem._id}`,
              {
                withCredentials: true,
              }
            );
            setIsInWishlistState(false);
            toast.success("Removed from wishlist");
            updateWishlistCount();
          }
        }
      } else {
        const wishlistData = {
          productId: standardProductId,
          productTitle: `${product.name} - ${selectedVariant.color}`,
          image: selectedVariant.images?.[0] || product.images?.[0],
          rating: product.rating || 0,
          price: Math.round(
            selectedVariant.discountedPrice ?? product.discountedPrice
          ),
          discount: selectedVariant.discount ?? product.discount ?? 0,
          oldPrice: Math.round(
            selectedVariant.originalPrice ?? product.originalPrice
          ),
          brand: product.brand,
        };

        await axios.post(
          `${API_BASE_URL}/api/v1/wishlist/createWishlist`,
          wishlistData,
          {
            withCredentials: true,
          }
        );

        setIsInWishlistState(true);
        toast.success("Added to wishlist");
        updateWishlistCount();
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      if (error.response?.status === 409) {
        toast.error("Item already in wishlist");
        setIsInWishlistState(true);
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };
  
  // Handle share modal open/close
  const handleOpenShareModal = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
    setLinkCopied(false);
  };
  
  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setLinkCopied(false);
  };
  
  // Get product URL
  const getProductUrl = () => {
    return `${window.location.origin}${location.pathname}`;
  };
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      navigator.clipboard.writeText(getProductUrl())
        .then(() => {
          setLinkCopied(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setLinkCopied(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast.error("Failed to copy link");
        });
    }
  };
  
  // Share functionality
  const handleShare = async (platform) => {
    const productUrl = getProductUrl();
    const productTitle = `${product.name} - ${selectedVariant.color}`;
    const productDescription = product.description || `Check out this ${product.brand} product!`;
    const productImage = selectedVariant.images?.[0] || product.images?.[0];
    const productPrice = `₹${Math.round(selectedVariant.discountedPrice ?? product.discountedPrice)}`;
    
    try {
      switch (platform) {
        case 'copy':
          copyToClipboard();
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${productTitle} - ${productPrice}\n${productDescription}\n`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${productTitle} - ${productPrice}\n${productDescription}\n${productUrl}`)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(productTitle)}&summary=${encodeURIComponent(productDescription)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`${productTitle} - ${productPrice}\n${productDescription}`)}`, '_blank');
          break;
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent(`${productDescription}\n\nPrice: ${productPrice}\n\nCheck it out here: ${productUrl}`)}`, '_blank');
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: productTitle,
              text: `${productDescription}\nPrice: ${productPrice}`,
              url: productUrl,
            });
            toast.success("Shared successfully!");
          } else {
            toast.error("Web Share API not supported on this browser");
          }
          break;
        default:
          break;
      }
      
      // Close modal after sharing (except for copy)
      if (platform !== 'copy') {
        setTimeout(() => {
          handleCloseShareModal();
        }, 300);
      }
      
    } catch (error) {
      console.error("Error sharing content:", error);
      toast.error("Failed to share");
    }
  };
  
  // Share platforms with their brand colors
  const sharePlatforms = [
    { 
      name: "Facebook", 
      icon: <Facebook />, 
      id: "facebook", 
      color: "#1877F2",
      bgColor: "#E7F0FF"
    },
    { 
      name: "WhatsApp", 
      icon: <WhatsApp />, 
      id: "whatsapp", 
      color: "#25D366",
      bgColor: "#E7FFEF"
    },
    { 
      name: "Twitter", 
      icon: <Twitter />, 
      id: "twitter", 
      color: "#1DA1F2",
      bgColor: "#E6F7FF"
    },
    { 
      name: "Telegram", 
      icon: <Telegram />, 
      id: "telegram", 
      color: "#0088CC",
      bgColor: "#E5F7FF"
    },
    { 
      name: "LinkedIn", 
      icon: <LinkedIn />, 
      id: "linkedin", 
      color: "#0A66C2",
      bgColor: "#E6F0FA"
    },
    { 
      name: "Email", 
      icon: <Email />, 
      id: "email", 
      color: "#EA4335",
      bgColor: "#FFEBE8" 
    },
  ];
  
  // Modal styles
  const modalStyle = {
    mobile: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      bgcolor: 'background.paper',
      borderRadius: '16px 16px 0 0',
      boxShadow: 24,
      p: 2,
      maxHeight: '70vh',
      overflowY: 'auto'
    },
    desktop: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 450,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 0,
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="w-full">
          {/* Main Image with Navigation */}
          <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            {/* Swiper */}
            <Swiper
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              onSlideChange={(swiper) => {
                setCurrentImageIndex(swiper.activeIndex);
                setSelectedImage(images[swiper.activeIndex]);
                setImageKey(Date.now());
              }}
              className="h-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onOpenGallery(images, idx)}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist();
              }}
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-110 active:scale-95 z-10 ${
                isInWishlistState
                  ? "text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
              title={
                isInWishlistState ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isInWishlistState ? (
                <FaHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <FaRegHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            
            {/* Share Button */}
            <button
              onClick={handleOpenShareModal}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-110 active:scale-95 z-10 text-gray-700 hover:text-blue-500"
              title="Share this product"
            >
              <FaShareAlt className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Fixed Bottom Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10 shadow-lg">
            <div className="flex gap-3 max-w-sm mx-auto">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff9f00] hover:bg-[#e68a00]"
                }`}
              >
                <BsFillCartFill className="text-lg" />
                <span className="text-sm">ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#fb641b] hover:bg-orange-600"
                }`}
              >
                <FaBolt className="text-base" />
                <span className="text-sm">BUY NOW</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Share Modal */}
          <Modal
            open={shareModalOpen}
            onClose={handleCloseShareModal}
            closeAfterTransition
          >
            <Slide direction="up" in={shareModalOpen}>
              <Box sx={modalStyle.mobile}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    Share this product
                  </Typography>
                  <IconButton onClick={handleCloseShareModal} size="small">
                    <Close />
                  </IconButton>
                </Box>
                
                {/* Product Preview */}
                <Box sx={{ display: 'flex', mb: 2, p: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                  <Box sx={{ width: 60, height: 60, mr: 1.5, flexShrink: 0 }}>
                    <img 
                      src={selectedVariant.images?.[0] || product.images?.[0]} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.brand} - {selectedVariant.color}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#388e3c', fontWeight: 600 }}>
                      ₹{Math.round(selectedVariant.discountedPrice ?? product.discountedPrice)}
                      {selectedVariant.discount && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
                          ₹{Math.round(selectedVariant.originalPrice ?? product.originalPrice)}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {/* Native share option if available */}
                {navigator.share && (
                  <>
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full py-3 px-4 bg-blue-500 text-white rounded-md font-medium mb-3 hover:bg-blue-600 transition"
                    >
                      Share via device
                    </button>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Or share via:
                    </Typography>
                  </>
                )}
                
                <div className="grid grid-cols-4 gap-4">
                  {sharePlatforms.map((platform) => (
                    <div 
                      key={platform.id} 
                      className="flex flex-col items-center cursor-pointer transition"
                      onClick={() => handleShare(platform.id)}
                      style={{ color: platform.color }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                        style={{ backgroundColor: platform.bgColor }}
                      >
                        {platform.icon}
                      </div>
                      <Typography variant="caption">{platform.name}</Typography>
                    </div>
                  ))}
                  
                  {/* Copy Link Button */}
                  <div 
                    className="flex flex-col items-center cursor-pointer transition"
                    onClick={() => handleShare('copy')}
                    style={{ color: '#607D8B' }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                      style={{ backgroundColor: '#ECEFF1' }}
                    >
                      <ContentCopy />
                    </div>
                    <Typography variant="caption">Copy Link</Typography>
                  </div>
                </div>
              </Box>
            </Slide>
          </Modal>
        </div>
      ) : (
        // Desktop Layout (Original)
        <div className="flex items-start gap-4 ml-5 mt-0">
          {/* Thumbnails */}
          <div className="flex flex-col justify-start gap-2">
            {selectedVariant.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb-${index}`}
                className={`w-16 h-16 rounded-lg cursor-pointer object-cover ${
                  selectedImage === img
                    ? "border-2 border-black"
                    : "border-2 border-transparent opacity-50"
                }`}
                onClick={() => handleImageClick(img, index)}
              />
            ))}
          </div>

          <div>
            {/* Main Image */}
            <div
              className="w-[350px] h-[460px] border rounded-md overflow-hidden relative custom-cursor"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                resetZoom();
              }}
              onClick={() =>
                onOpenGallery(selectedVariant.images, currentImageIndex)
              }
            >
              <img
                key={imageKey}
                src={selectedImage}
                alt="Product"
                className="w-full h-full object-cover transition-all duration-300"
                style={isHovering ? zoomStyle : {}}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist();
                }}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition ${
                  isInWishlistState
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
                title={
                  isInWishlistState ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlistState ? (
                  <FaHeart size={22} className="text-red-500" />
                ) : (
                  <FaRegHeart size={22} className="text-gray-400" />
                )}
              </button>
              
              {/* Share Button - Desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenShareModal(e);
                }}
                className="absolute top-14 right-3 p-2 rounded-full bg-white shadow-md transition text-gray-600 hover:text-blue-500"
                title="Share this product"
              >
                <FaShareAlt size={22} className="text-gray-400" />
              </button>
            </div>

            {/* Cart and Buy buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff9f00] hover:bg-[#e68a00]"
                }`}
              >
                <BsFillCartFill className="text-lg" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#fb641b] hover:bg-orange-600"
                }`}
              >
                <FaBolt className="text-base" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>
          
          {/* Desktop Share Modal - Redesigned */}
          <Dialog
            open={shareModalOpen}
            onClose={handleCloseShareModal}
            TransitionComponent={Fade}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                overflow: 'visible',
              }
            }}
          >
            <Box sx={{ 
              background: 'linear-gradient(145deg, #6366F1 0%, #8B5CF6 100%)',
              color: 'white',
              p: 2,
              borderRadius: '8px 8px 0 0',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Share this product</Typography>
                <IconButton onClick={handleCloseShareModal} size="small" sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            
            <DialogContent sx={{ p: 3 }}>
              {/* Product Preview */}
              <Paper elevation={0} sx={{ display: 'flex', mb: 3, p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1.5 }}>
                <Box sx={{ width: 70, height: 70, mr: 2, flexShrink: 0 }}>
                  <img 
                    src={selectedVariant.images?.[0] || product.images?.[0]} 
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </Box>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.brand} - {selectedVariant.color}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#388e3c', fontWeight: 600, mt: 0.5 }}>
                    ₹{Math.round(selectedVariant.discountedPrice ?? product.discountedPrice)}
                    {selectedVariant.discount && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
                        ₹{Math.round(selectedVariant.originalPrice ?? product.originalPrice)}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Paper>
              
              {/* Copy Link Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Copy link
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    inputRef={linkInputRef}
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={getProductUrl()}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ display: 'flex', mr: 1, color: 'action.active' }}>
                          <LinkIcon fontSize="small" />
                        </Box>
                      ),
                      readOnly: true,
                      sx: { 
                        borderRadius: 2,
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={copyToClipboard}
                    sx={{
                      minWidth: 'unset',
                      px: 2,
                      bgcolor: linkCopied ? 'success.main' : 'primary.main',
                      '&:hover': {
                        bgcolor: linkCopied ? 'success.dark' : 'primary.dark',
                      },
                      borderRadius: 2,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>
              </Box>
              
              {/* Share Platforms */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                Share via
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start' }}>
                {sharePlatforms.map((platform) => (
                  <Paper
                    key={platform.id}
                    elevation={0}
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      bgcolor: platform.bgColor,
                      borderRadius: 2,
                      width: 80,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      }
                    }}
                    onClick={() => handleShare(platform.id)}
                  >
                    <Box sx={{ 
                      color: platform.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 0.5
                    }}>
                      {platform.icon}
                    </Box>
                    <Typography variant="caption" sx={{ color: platform.color, fontWeight: 500 }}>
                      {platform.name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;