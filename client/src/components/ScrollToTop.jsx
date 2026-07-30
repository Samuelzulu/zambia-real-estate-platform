import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router preserves scroll position across client-side navigations
// by default (it's not a real page load). This forces every route change
// to start at the top, matching normal website behavior.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
