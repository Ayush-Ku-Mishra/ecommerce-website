import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser, FaRegHeart, FaCloudUploadAlt } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineShoppingBag } from "react-icons/hi";
import axios from "axios";
import { Context } from "../main";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const menuItems = [
  {
    text: "My Profile",
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
  // REMOVE Logout from menuItems!
];

const defaultAvatar = "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";

const AccountDetailsSection = () => {
  const location = useLocation();
  const { user, setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  // Use user email (or id) for storage key
  const localStorageKey = user ? `avatarUrl_${user.email}` : "avatarUrl_guest";

  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    const storedAvatar = localStorage.getItem(localStorageKey);
    setAvatar(storedAvatar || defaultAvatar);
  }, [localStorageKey]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64String = await toBase64(file);
        setAvatar(base64String);
        localStorage.setItem(localStorageKey, base64String);
      } catch (error) {
        console.error("Failed to read file as base64:", error);
      }
    }
  };

  // Logout logic and modal
  const [showConfirm, setShowConfirm] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col items-center mt-5 mx-auto rounded-xl border-2">
      {/* Avatar */}
      <div className="bg-white w-full shadow py-5 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden">
        <label
          htmlFor="avatar-upload"
          className="relative w-28 h-28 block rounded-full overflow-hidden"
        >
          <img
            src={avatar}
            alt="Account Avatar"
            className="w-28 h-28 rounded-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
            <FaCloudUploadAlt className="text-white text-3xl" />
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          className="hidden"
          onChange={handleImageChange}
        />

        <div className="flex flex-col items-start mt-3 px-5 w-auto min-w-0">
          <span
            className="block font-semibold text-gray-700 leading-tight whitespace-nowrap"
            style={{ fontSize: "clamp(12px, 5vw, 17px)" }}
            title={user?.name}
          >
            {user?.name || "Guest"}
          </span>
          <span
            className="block text-gray-500 whitespace-nowrap"
            style={{ fontSize: "clamp(10px, 3vw, 13px)" }}
            title={user?.email}
          >
            {user?.email || ""}
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="w-full bg-gray-100 shadow px-4 py-5 flex flex-col gap-1">
        {menuItems.map((item) => {
          // Dynamically check if current path matches or starts with this menu item's 'to'
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

        {/* Logout button */}
        <button
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition text-gray-800 font-medium text-[15px]"
          onClick={() => setShowConfirm(true)}
          type="button"
        >
          <IoPowerSharp />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout confirmation modal */}
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
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
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
