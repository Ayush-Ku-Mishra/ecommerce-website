// hooks/useScrollRestoration.js
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const path = location.pathname + location.search;

    // Load scroll positions from sessionStorage
    const savedScrollPositions = JSON.parse(sessionStorage.getItem("scroll-positions") || "{}");

    if (navigationType === "POP") {
      const saved = savedScrollPositions[path];
      if (saved) {
        window.scrollTo(saved.x, saved.y);
      }
    } else {
      // Normal navigation: scroll to top
      window.scrollTo(0, 0);
    }

    return () => {
      // Save scroll position before navigating away
      savedScrollPositions[path] = {
        x: window.scrollX,
        y: window.scrollY,
      };
      sessionStorage.setItem("scroll-positions", JSON.stringify(savedScrollPositions));
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;
