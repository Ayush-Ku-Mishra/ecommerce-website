import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";

import IntroImage from "./assets/IntroImagePickora.jpg";

// Layout and Pages
import MainLayout from "./Components/MainLayout";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Wishlist from "./Components/Wishlist";
import Cart from "./Components/Cart";
import Fashion from "./Components/Fashion";
import Electronics from "./Components/Electronics";
import Bags from "./Components/Bags";
import FootWear from "./Components/FootWear";
import Groceries from "./Components/Groceries";
import Beauty from "./Components/Beauty";
import Furnitures from "./Components/Furnitures";
import Jewellery from "./Components/Jewellery";
import ServicePage from "./Components/ServicePage";
import ContactUsPart from "./Components/ContactUsPart";
import SingleProductDetails from "./Components/SingleProductDetails";
import GlobalLoadingSkeleton from "./Components/GlobalLoadingSkeleton";
import GridProductCategory from "./Components/GridProductCategory";
import SidebarFilterComponent from "./Components/SidebarFilterComponent";
import MyOrders from "./Components/MyOrders";
import OrderDetailsPage from "./Components/OrderDetailsPage";
import SavedAddress from "./Components/SavedAddress";
import CheckoutPage from "./Components/CheckoutPage";
import MyProfile from "./Components/MyProfile";
import ResetPassword from "./pages/ResetPassword";
import NotFoundPage from "./Components/NotFoundPage";
import { Toaster } from "react-hot-toast";
import logo from "./assets/PickoraFavicon.png";
import OrderSuccessPage from "./Components/OrderSuccessPage";
import FloatingNotification from "./Components/FloatingNotification";
import ReturnReason from "./Components/ReturnReason";
import { setupAxiosInterceptors } from "./utils/setupAxios";
import NetworkStatus from "./Components/NetworkStatus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "product/:id",
        element: <SingleProductDetails />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "order-success",
        element: <OrderSuccessPage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "fashion",
        element: <Fashion />,
      },
      {
        path: "electronics",
        element: <Electronics />,
      },
      {
        path: "bags",
        element: <Bags />,
      },
      {
        path: "footwear",
        element: <FootWear />,
      },
      {
        path: "groceries",
        element: <Groceries />,
      },
      {
        path: "beauty",
        element: <Beauty />,
      },
      {
        path: "furnitures",
        element: <Furnitures />,
      },
      {
        path: "jewellery",
        element: <Jewellery />,
      },
      {
        path: "help",
        element: <ContactUsPart />,
      },
      {
        path: "contact",
        element: <ContactUsPart />,
      },
      {
        path: "service",
        element: <ServicePage />,
      },
      {
        path: "products",
        element: (
          <GridProductCategory
            SidebarFilterComponent={SidebarFilterComponent}
          />
        ),
      },
      {
        path: "account/orders",
        element: <MyOrders />,
      },
      {
        path: "account/orders/:orderId",
        element: <OrderDetailsPage />,
      },
      {
        path: "account/address",
        element: <SavedAddress />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "account/profile",
        element: <MyProfile />,
      },
      {
        path: "search",
        element: <GridProductCategory />,
      },

      {
        path: "/account/orders/:orderId/return",
        element: <ReturnReason />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "password/reset/:token",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

setupAxiosInterceptors();

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const isIntroShown = sessionStorage.getItem("introShown");
    if (!isIntroShown) {
      setShowIntro(true);
      setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("introShown", "true");
      }, 2000);
    }
  }, []);

  return (
    <div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          icon: (
            <img
              src={logo}
              alt="logo"
              style={{ width: 20, height: 20, borderRadius: "50%" }}
            />
          ),
          style: {
            borderRadius: "15px",
            background: "#333",
            color: "#fff",
            marginBottom: "60px",
          },
        }}
      />

      <GlobalLoadingSkeleton />
      {showIntro ? (
        <div className="w-screen h-screen flex items-center justify-center bg-white z-[9999] fixed top-0 left-0">
          <img
            src={IntroImage}
            alt="Intro"
            className="w-[300px] h-[300px] object-contain"
          />
        </div>
      ) : (
        <>
          <RouterProvider router={router} />
          <FloatingNotification />
          <NetworkStatus /> 
        </>
      )}
    </div>
  );
}

export default App;
