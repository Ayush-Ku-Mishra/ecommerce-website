import React from 'react';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
