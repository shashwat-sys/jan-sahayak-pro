import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker: string;
  title: string;
  copy: string;
  meta?: string;
  actions?: ReactNode;
};

export function PageHeader({ actions, copy, kicker, meta, title }: PageHeaderProps) {
  return (
    <div className="page-hero">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-copy">{copy}</p>
        {meta ? <p className="page-meta">{meta}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}
