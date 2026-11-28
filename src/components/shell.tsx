import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Shell({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("mx-auto w-full min-w-0 max-w-7xl px-4", className)}>
      {children}
    </div>
  );
}
