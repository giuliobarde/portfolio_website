"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't render the old footer on /v4 route
  if (pathname?.startsWith("/v4")) {
    return null;
  }
  
  return <Footer />;
}
