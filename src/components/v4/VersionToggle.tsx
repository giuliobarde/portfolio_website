"use client";

import { cn } from "@/lib/utils";

const versions = ["v3", "v4"] as const;
type Version = (typeof versions)[number];

interface VersionToggleProps {
  currentVersion: Version;
}

export function VersionToggle({ currentVersion }: VersionToggleProps) {
  return (
    <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5 font-mono text-[10px]">
      {versions.map((v) => {
        const isActive = v === currentVersion;
        return (
          <a
            key={v}
            href={`/${v}`}
            className={cn(
              "px-2.5 py-1 rounded-full transition-all duration-200 leading-none",
              isActive
                ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {v}
          </a>
        );
      })}
    </div>
  );
}
