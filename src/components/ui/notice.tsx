import type { PropsWithChildren } from "react";

type NoticeProps = PropsWithChildren<{
  title: string;
  tone?: "accent" | "red" | "green";
}>;

export function Notice({ children, title, tone = "accent" }: NoticeProps) {
  return (
    <div className="callout" data-tone={tone}>
      <div>
        <div className="callout-title">{title}</div>
        <div className="callout-copy">{children}</div>
      </div>
    </div>
  );
}
