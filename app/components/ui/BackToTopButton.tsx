import React, { useEffect, useState } from "react";
import { HiChevronDoubleUp } from "react-icons/hi";
import cn from "clsx";

function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const isBottom =
        window.innerHeight + Math.round(window.scrollY) + 400 >=
        document.body.offsetHeight;
      setShowButton(isBottom);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!showButton) return null;
  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed right-8 bg-blue-600 text-white py-3 px-3 rounded-md z-10 hover:scale-110 transition-transform duration-150 ease-in-out",
        showButton ? "bottom-8" : "-bottom-16"
      )}
    >
      <HiChevronDoubleUp className="w-4 h-4" />
    </button>
  );
}

export default BackToTopButton;
