import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser, FaRegHeart, FaCloudUploadAlt } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineShoppingBag } from "react-icons/hi";
import axios from "axios";
import { Context } from "../main";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const menuItems = [
  {
    text: "My Account",
    icon: <FaRegUser />,
    to: "/account/profile",
  },
  {
    text: "Saved Address",
    icon: <SlLocationPin />,
    to: "/account/address",
  },
  {
    text: "My Wishlist",
    icon: <FaRegHeart />,
    to: "/wishlist",
  },
  {
    text: "My Orders",
    icon: <HiOutlineShoppingBag />,
    to: "/account/orders",
  },
];

const defaultAvatar = "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";

const AccountDetailsSection = () => {
  const location = useLocation();
  const { user, setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const localStorageKey = user ? `avatarUrl_${user.email}` : "avatarUrl_guest";

  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatar);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    // Use user avatar from context first, then localStorage, then default
    if (user?.avatar) {
      setAvatar(user.avatar);
    } else {
      const storedAvatar = localStorage.getItem(localStorageKey);
      setAvatar(storedAvatar || defaultAvatar);
    }
  }, [localStorageKey, user?.avatar]);

  // ✅ Fixed image upload function
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid jpg, png or webp file.");
      return;
    }

    // Validate file size (optional - e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      console.log(
        "Uploading to:",
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/user-avtar`
      );

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/user-avtar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", data);

      if (data.success) {
        // Backend returns avatar as array, take first element
        const newAvatarUrl = Array.isArray(data.avatar)
          ? data.avatar[0]
          : data.avatar;

        // Update avatar in state
        setAvatar(newAvatarUrl);

        // Update user context with new avatar
        setUser((prevUser) => ({
          ...prevUser,
          avatar: newAvatarUrl,
        }));

        // Update localStorage
        localStorage.setItem(localStorageKey, newAvatarUrl);

        // Update user info in localStorage
        const userInfo = localStorage.getItem("user-info");
        if (userInfo) {
          const parsedUserInfo = JSON.parse(userInfo);
          parsedUserInfo.avatar = newAvatarUrl;
          localStorage.setItem("user-info", JSON.stringify(parsedUserInfo));
        }

        toast.success("Profile picture updated successfully!");
      } else {
        toast.error(data.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      if (error.response?.status === 404) {
        toast.error(
          "Upload endpoint not found. Please check server configuration."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const clientToken = localStorage.getItem("client_token");

      if (clientToken) {
        // Use token-based logout for client
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
          {
            headers: {
              Authorization: `Bearer ${clientToken}`,
              "X-Client-Request": "true",
            },
          }
        );
      } else {
        // Fallback to cookie-based logout
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
          {
            withCredentials: true,
            headers: {
              "X-Client-Request": "true",
            },
          }
        );
      }

      // Clear client-specific localStorage
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_user");
      localStorage.removeItem("user-info"); // Legacy cleanup

      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Client logout error:", error);

      // Even if backend call fails, clear local storage
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_user");
      localStorage.removeItem("user-info");

      setIsAuthenticated(false);
      setUser(null);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex flex-col items-center lg:mt-5 mt-0 mx-auto rounded-xl border-2">
      {/* Avatar - Always at top */}
      <div className="bg-white w-full shadow py-5 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden">
        <label
          htmlFor="avatar-upload"
          className="relative w-28 h-28 block rounded-full overflow-hidden cursor-pointer"
        >
          {uploading ? (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
              <CircularProgress color="inherit" size={24} />
            </div>
          ) : (
            <img
              src={avatar}
              alt="Account Avatar"
              className="w-28 h-28 rounded-full object-cover"
              onError={() => setAvatar(defaultAvatar)} // Fallback if image fails to load
            />
          )}

          {/* Overlay on hover */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
            <FaCloudUploadAlt className="text-white text-3xl" />
          </div>
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          id="avatar-upload"
          className="hidden"
          onChange={handleImageChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-start mt-3 px-5 w-auto min-w-0">
          <span
            className="block font-semibold text-gray-700 leading-tight whitespace-nowrap text-lg sm:text-base lg:text-[17px]"
            title={user?.name}
          >
            {user?.name || "Guest"}
          </span>

          <span
            className="block text-gray-500 whitespace-nowrap text-sm sm:text-sm lg:text-[13px]"
            title={user?.email}
          >
            {user?.email || ""}
          </span>
        </div>
      </div>

      {/* Menu - Desktop: Vertical list, Mobile/Tablet: Grid layout */}
      <div className="w-full bg-gray-100 shadow px-4 py-5">
        {/* Desktop Layout - Hidden on mobile/tablet */}
        <div className="hidden lg:flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                to={item.to}
                key={item.text}
                className={`
                  flex items-center gap-2 p-2 rounded-lg hover:bg-white
                  transition
                  ${
                    isActive
                      ? "bg-white !text-pink-600 font-semibold"
                      : "text-gray-800"
                  }
                `}
              >
                {item.icon}
                <span className="font-medium text-[15px]">{item.text}</span>
              </Link>
            );
          })}

          {/* Logout button - Desktop */}
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition text-gray-800 font-medium text-[15px]"
            onClick={() => setShowConfirm(true)}
            type="button"
            disabled={loading}
          >
            <IoPowerSharp />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile/Tablet Layout - 2x2 grid + centered logout */}
        <div className="lg:hidden">
          {/* Grid for menu items - 2 items per row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  to={item.to}
                  key={item.text}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white
                    transition text-center
                    ${
                      isActive
                        ? "bg-white !text-pink-600 font-semibold"
                        : "text-gray-800"
                    }
                  `}
                >
                  <div className="text-xl">{item.icon}</div>
                  <span className="font-medium text-sm">{item.text}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout button - Mobile/Tablet - Centered */}
          <div className="flex justify-center">
            <button
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white transition text-gray-800 font-medium text-sm min-w-[120px]"
              onClick={() => setShowConfirm(true)}
              type="button"
              disabled={loading}
            >
              <IoPowerSharp className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loader Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Logout Confirmation */}
      {showConfirm &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 text-gray-800">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AccountDetailsSection;
