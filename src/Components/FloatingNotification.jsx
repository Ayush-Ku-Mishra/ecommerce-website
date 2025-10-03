import React, { useState, useEffect, useRef } from "react";
import { IoNotifications, IoClose, IoTrashOutline } from "react-icons/io5";
import {
  FaShoppingBag,
  FaExchangeAlt,
  FaShippingFast,
  FaBoxOpen,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaBox,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Skeleton from "@mui/material/Skeleton";
import { useNotifications } from "../hooks/useNotifications";

const FloatingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const isLoginPage = window.location.pathname === "/login";

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    const type = notification.type;

    // Define icon colors based on notification type
    const iconColors = {
      new_order: "text-green-500",
      order_shipped: "text-blue-500",
      order_delivered: "text-purple-500",
      order_cancelled: "text-red-500",
      payment_received: "text-emerald-500",
      new_return: "text-amber-500",
      return_updated: "text-indigo-500",
      return_cancelled: "text-rose-500",
      status_update: "text-cyan-500",
      default: "text-gray-500",
    };

    // Get the appropriate color
    const colorClass = iconColors[type] || iconColors.default;

    // Return the appropriate icon with color
    switch (type) {
      case "new_order":
        return <FaShoppingBag className={`${colorClass} text-xl`} />;
      case "order_shipped":
        return <FaShippingFast className={`${colorClass} text-xl`} />;
      case "order_delivered":
        return <FaBoxOpen className={`${colorClass} text-xl`} />;
      case "order_cancelled":
        return <FaTimes className={`${colorClass} text-xl`} />;
      case "payment_received":
        return <FaMoneyBillWave className={`${colorClass} text-xl`} />;
      case "new_return":
        return <FaExchangeAlt className={`${colorClass} text-xl`} />;
      case "return_updated":
        return <FaBox className={`${colorClass} text-xl`} />;
      case "return_cancelled":
        return <FaTimes className={`${colorClass} text-xl`} />;
      case "status_update":
        return <FaCheck className={`${colorClass} text-xl`} />;
      default:
        return <FaInfoCircle className={`${colorClass} text-xl`} />;
    }
  };

  // Get background color based on notification type
  const getNotificationBgColor = (notification) => {
    const type = notification.type;

    if (!notification.isRead) {
      return "bg-blue-50";
    }

    switch (type) {
      case "new_order":
        return "hover:bg-green-50";
      case "order_cancelled":
        return "hover:bg-red-50";
      case "payment_received":
        return "hover:bg-emerald-50";
      case "new_return":
        return "hover:bg-amber-50";
      case "return_updated":
        return "hover:bg-indigo-50";
      case "return_cancelled":
        return "hover:bg-rose-50";
      default:
        return "hover:bg-gray-50";
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification._id);
    if (notification.link) {
      setIsOpen(false);
      window.location.href = notification.link;
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (isLoginPage) return null;

  return (
    <>
      {/* Floating Button with Pulse Animation */}
      <motion.button
        ref={buttonRef}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors hidden md:flex"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <IoNotifications className="text-2xl" />
          {unreadCount > 0 && (
            <>
              {/* Pulsing effect for unread notifications */}
              <span className="absolute -top-2 -right-2 animate-ping h-5 w-5 rounded-full bg-red-400 opacity-75"></span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </div>
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoNotifications className="text-xl" />
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm hover:underline flex items-center gap-1"
                  >
                    <FaCheck className="text-xs" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-700 p-1 rounded-full"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex gap-3">
                      <Skeleton
                        variant="circular"
                        width={36}
                        height={36}
                        animation="wave"
                        sx={{
                          bgcolor: "#C7CCD8",
                        }}
                      />
                      <div className="flex-1">
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={20}
                          animation="wave"
                          sx={{
                            bgcolor: "#C7CCD8",
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="90%"
                          height={14}
                          animation="wave"
                          sx={{
                            bgcolor: "#C7CCD8",
                            mt: 1,
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="40%"
                          height={12}
                          animation="wave"
                          sx={{
                            bgcolor: "#C7CCD8",
                            mt: 1,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <IoNotifications className="text-3xl text-gray-400" />
                  </div>
                  <p className="font-medium">No notifications yet</p>
                  <p className="text-sm mt-1">
                    We'll notify you when something arrives
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 transition-colors cursor-pointer group ${
                        !notification.isRead
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : getNotificationBgColor(notification)
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        {/* Icon Circle */}
                        <div
                          className={`w-10 h-10 rounded-full ${
                            !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                          } flex items-center justify-center flex-shrink-0`}
                        >
                          {getNotificationIcon(notification)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900 truncate pr-8">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="ml-2 p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <IoTrashOutline className="text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* Footer with time and link */}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            {notification.link && (
                              <span className="text-blue-600 text-xs font-medium hover:underline">
                                View details →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNotification;
