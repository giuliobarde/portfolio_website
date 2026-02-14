"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HEADER_SCROLL_OFFSET } from "@/lib/prismic-helpers";

export default function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser's automatic scroll restoration on refresh
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Handle hash navigation on page load
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1); // Remove the #
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const headerOffset = HEADER_SCROLL_OFFSET;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 100); // Small delay to ensure DOM is ready
      } else {
        // If no hash, scroll to top on page refresh/load
        window.scrollTo(0, 0);
      }
    };

    // Handle initial hash or scroll to top
    handleHashNavigation();

    // Handle hash changes (when clicking links)
    const handleHashChange = () => {
      handleHashNavigation();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
}

