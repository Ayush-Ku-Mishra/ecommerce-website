import React, { useState } from "react";
import ReactDOM from "react-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { BiCategory, BiGift } from "react-icons/bi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Modal from "@mui/material/Modal";

const MobileBottomNav = ({
  SidebarFilterComponent,
  filterProps,
  shouldShowFilter,
  setSidebarOpen,
  user,
  onFilterClick,
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (
    location.pathname.startsWith("/product/") ||
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/account/address") ||
    location.pathname.startsWith("/wishlist") ||
    location.pathname.startsWith("/account/orders") ||
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/order-success")
  ) {
    return null;
  }

  const openFilterModal = () => {
    setFilterModalOpen(true);
    // Call the onFilterClick if provided
    if (onFilterClick) {
      onFilterClick();
    }
  };

  const closeFilterModal = () => setFilterModalOpen(false);

  // Enhanced filter props with modal close functionality
  const enhancedFilterProps = {
    ...filterProps,
    onApplyFilters: () => {
      // Apply filters and close modal
      if (filterProps?.onApplyFilters) {
        filterProps.onApplyFilters();
      }
      closeFilterModal();
    },
  };

  // Handle account navigation
  const handleAccountClick = () => {
    const accountPath = user ? "/account/profile" : "/login";
    console.log("Account button clicked, navigating to:", accountPath); // Debug log
    navigate(accountPath);
  };

  // Check if account path is active
  const accountPath = user ? "/account/profile" : "/login";
  const isAccountActive = location.pathname === accountPath;

  return ReactDOM.createPortal(
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[999] md:hidden">
        <div
          className={`flex items-center justify-around py-2 ${
            shouldShowFilter() ? "px-1" : ""
          }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? "text-pink-600" : "text-gray-600"
              }`
            }
          >
            <IoHomeSharp className="text-xl mb-1" />
            <span className="text-xs font-medium">Home</span>
          </NavLink>

          {shouldShowFilter() && (
            <button
              onClick={openFilterModal}
              className="flex flex-col items-center py-1 px-2 text-gray-600 transition-colors hover:text-pink-600"
            >
              <FiFilter className="text-xl mb-1" />
              <span className="text-xs font-medium">Filter</span>
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center py-1 px-2 text-gray-600 transition-colors hover:text-pink-600"
          >
            <BiCategory className="text-xl mb-1" />
            <span className="text-xs font-medium">Category</span>
          </button>

          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? "text-pink-600" : "text-gray-600"
              }`
            }
          >
            <BiGift className="text-xl mb-1" />
            <span className="text-xs font-medium">Offers</span>
          </NavLink>

          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? "text-pink-600" : "text-gray-600"
              }`
            }
          >
            <HiOutlineShoppingBag className="text-xl mb-1" />
            <span className="text-xs font-medium">Orders</span>
          </NavLink>

          {/* Use button with onClick handler for Account */}
          <NavLink
            to={user ? "/account/profile" : "/login"}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? "text-pink-600" : "text-gray-600"
              }`
            }
          >
            <FaRegUser className="text-xl mb-1" />
            <span className="text-xs font-medium">Account</span>
          </NavLink>
        </div>
      </div>

      {/* Fullscreen Modal for Filter Sidebar */}
      <Modal
        open={filterModalOpen}
        onClose={closeFilterModal}
        aria-labelledby="filter-modal"
        aria-describedby="filter-modal-description"
      >
        <div className="fixed inset-0 bg-white flex flex-col scrollbar-hide">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={closeFilterModal}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Filter content - scrollable */}
          <div className="flex-1 overflow-y-auto p-4 pb-28 scrollbar-hide">
            {/* Render SidebarFilterComponent if provided */}
            {SidebarFilterComponent ? (
              <SidebarFilterComponent {...enhancedFilterProps} />
            ) : (
              <p className="text-gray-500 text-center">
                No filter component available.
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>,
    document.body
  );
};

export default MobileBottomNav;
