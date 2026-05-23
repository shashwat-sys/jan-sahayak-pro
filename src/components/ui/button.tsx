import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: "primary" | "secondary" | "danger" | "ghost";
    size?: "default" | "small";
  }
>;

export function Button({
  children,
  className,
  tone = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn", `btn-${tone}`, size === "small" && "small", className)}
      {...props}
    >
      {children}
    </button>
  );
}
