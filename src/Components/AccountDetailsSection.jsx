import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FaRegUser, FaRegHeart, FaCloudUploadAlt } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineShoppingBag } from "react-icons/hi";

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
  {
    text: "Logout",
    icon: <IoPowerSharp />,
    to: "/logout",
  },
];

const AccountDetailsSection = () => {
  const user = {
    name: "Ayush Kumar Mishra",
    email: "amishra59137@gmail.com",
  };

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";

  // Initialize avatar from localStorage or fallback to default
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("avatarUrl") || defaultAvatar;
  });

  // Convert file to base64 string
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
        localStorage.setItem("avatarUrl", base64String);
      } catch (error) {
        console.error("Failed to read file as base64:", error);
      }
    }
  };

  const location = useLocation(); // Get current location

  return (
    <div className="flex flex-col items-center mt-5 w-[240px] mx-auto rounded-xl border-2">
      {/* Avatar */}
      <div className="bg-white w-full shadow p-5 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden">
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

        <div className="flex flex-col items-start mt-3 px-5 w-full">
          <span
            className="block font-semibold text-gray-700 truncate text-[17px] leading-tight"
            style={{ maxWidth: "100%", fontSize: "clamp(12px, 5vw, 17px)" }}
            title={user.name}
          >
            {user.name}
          </span>
          <span
            className="block text-gray-500 truncate text-[13px]"
            style={{ maxWidth: "100%", fontSize: "clamp(10px, 3vw, 13px)" }}
            title={user.email}
          >
            {user.email}
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
      </div>
    </div>
  );
};

export default AccountDetailsSection;
