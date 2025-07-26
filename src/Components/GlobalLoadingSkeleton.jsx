// src/components/GlobalLoadingSkeleton.jsx
import React from "react";
import { useSelector } from "react-redux";

const GlobalLoadingSkeleton = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-60 flex items-center justify-center">
      {/* Spinner, Pulse, Skeleton - style as you wish */}
      <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-lg shadow-lg flex items-center justify-center text-xl text-gray-500">
        Loading...
      </div>
    </div>
  );
};

export default GlobalLoadingSkeleton;
