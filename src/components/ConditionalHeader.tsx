"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't render the old header on /v4 route
  if (pathname?.startsWith("/v4")) {
    return null;
  }
  
  return <Header />;
}
