import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // Reset immediately for page changes
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
