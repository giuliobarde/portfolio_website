"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't render the old footer on /v3 and /v4 routes (they have their own layouts)
  if (pathname?.startsWith("/v3") || pathname?.startsWith("/v4")) {
    return null;
  }
  
  return <Footer />;
}
