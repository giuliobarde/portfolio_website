"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't render the old header on /v3 and /v4 routes (they have their own layouts)
  if (pathname?.startsWith("/v3") || pathname?.startsWith("/v4")) {
    return null;
  }
  
  return <Header />;
}
