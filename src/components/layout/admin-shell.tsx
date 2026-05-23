"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/pro", label: "Pro Workspace", icon: "🧭" },
  { href: "/knowledge", label: "Knowledge Studio", icon: "📚" },
  { href: "/cases", label: "Cases", icon: "⚖" },
  { href: "/activities", label: "Activities", icon: "🏕" },
  { href: "/finance", label: "Grants & Expenses", icon: "💰" },
  { href: "/monthly-reports", label: "Monthly Reports", icon: "📓" },
  { href: "/reports", label: "Reports", icon: "📋" },
  { href: "/drafter", label: "Drafter", icon: "📝" },
  { href: "/team", label: "Team", icon: "👥" },
] as const;

type AdminShellProps = {
  children: React.ReactNode;
  userName: string;
  overdueCaseCount: number;
  showUserButton: boolean;
};

export function AdminShell({
  children,
  userName,
  overdueCaseCount,
  showUserButton,
}: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-lockup">
            <div className="brand-icon">⚖</div>
            <div>
              <div className="brand-name">Jan Sahayak Pro</div>
              <div className="brand-subtitle">
                Janman Peoples Foundation · Jan Nyaya Abhiyan · Admin Workspace
              </div>
            </div>
          </div>
          <div className="button-row">
            {overdueCaseCount > 0 ? <Badge tone="red">{overdueCaseCount} overdue</Badge> : null}
            <Badge tone="green">Patna · Purnia network</Badge>
            <Badge>{userName}</Badge>
            {showUserButton ? <UserButton /> : <Badge tone="blue">Demo Mode</Badge>}
          </div>
        </div>
        <nav className="nav-strip">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-link",
                pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : "",
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-frame">{children}</main>
    </div>
  );
}
