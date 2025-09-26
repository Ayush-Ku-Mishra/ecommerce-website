import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";
import { Outlet, useLocation } from "react-router-dom";
import { Context } from "../main";


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(Context);

  // Use the same exclusion logic as MobileBottomNav to detect if it should show
  const mobileNavHiddenPaths = [
    "/product/",
    "/cart",
    "/account/address",
    "/wishlist",
    "/account/orders",
    "/checkout",
    "/order-success",
  ];
  const showMobileBottomNav = !mobileNavHiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Your filter button visibility logic
  const shouldShowFilter = () => {
    const pathsWithFilter = [
      "/fashion",
      "/electronics",
      "/bags",
      "/footwear",
      "/groceries",
      "/beauty",
    ];
    return (
      pathsWithFilter.some((path) => location.pathname.includes(path)) ||
      location.pathname.includes("/products")
    );
  };

  const onFilterClick = () => {
    // your filter toggle logic if any
  };

  return (
    <>
      <ScrollToTop />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Conditionally add bottom padding only when mobile nav shows */}
      <div className={showMobileBottomNav ? "pb-16 lg:pb-0" : "pb-0"}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
