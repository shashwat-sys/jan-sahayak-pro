import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
  }
>;

export function Card({ children, className, compact = false, ...props }: CardProps) {
  return (
    <div className={cn("panel", compact && "tight", className)} {...props}>
      {children}
    </div>
  );
}
