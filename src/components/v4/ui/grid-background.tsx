import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      {children}
    </div>
  );
}

export function DotBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "[background-size:16px_16px]",
          "[background-image:radial-gradient(circle,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(circle,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      {children}
    </div>
  );
}
