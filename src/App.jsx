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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
         index: true, 
         element: <Home /> 
      },
      { 
        path: "login", 
        element: <Login /> 
      },
      { 
        path: "product/:id", 
        element: <SingleProductDetails/>
      },
      { 
        path: "wishlist", 
        element: <Wishlist /> 
      },
      { 
        path: "cart", 
        element: <Cart /> 
      },
      { 
        path: "fashion", 
        element: <Fashion /> 
      },
      { 
        path: "electronics", 
        element: <Electronics /> 
      },
      {
        path: "bags", 
        element: <Bags /> 
      },
      { 
        path: "footwear", 
        element: <FootWear /> 
      },
      { 
        path: "groceries", 
        element: <Groceries /> 
      },
      { 
        path: "beauty", 
        element: <Beauty /> 
      },
      { 
        path: "furnitures", 
        element: <Furnitures /> 
      },
      { 
        path: "jewellery", 
        element: <Jewellery /> 
      },
      { 
        path: "/help", 
        element: <ContactUsPart/>
      },
      { 
        path: "contact", 
        element: <ContactUsPart /> 
      },
      { 
        path: "service", 
        element: <ServicePage /> 
      },
    ],
  },
]);

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
      {showIntro ? (
        <div className="w-screen h-screen flex items-center justify-center bg-white z-[9999] fixed top-0 left-0">
          <img
            src={IntroImage}
            alt="Intro"
            className="w-[300px] h-[300px] object-contain"
          />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
