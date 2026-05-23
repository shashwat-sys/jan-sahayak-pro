import type { HTMLAttributes, PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    tone?: "accent" | "red" | "green" | "blue" | "purple";
  }
>;

export function Badge({ children, tone = "accent", ...props }: BadgeProps) {
  return (
    <span className="chip" data-tone={tone} {...props}>
      {children}
    </span>
  );
}
