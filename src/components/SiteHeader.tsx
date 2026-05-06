import { Link } from "@tanstack/react-router";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/predict", label: "Predict" },
  { to: "/recommend", label: "Recommend" },
  { to: "/disease", label: "Disease Scan" },
  { to: "/chat", label: "AI Assistant" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sprout className="h-5 w-5" />
          </span>
          AgriSmart
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              activeOptions={{ exact: it.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background px-4 py-3">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {it.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
