import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  CheckSquare,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Sparkles,
  Sun,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "AI Task Planner", icon: Sparkles },
] as const;

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("awpa.theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("awpa.theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {open ? (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-foreground/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar p-4 transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-2 pb-7">
          <div className="bg-hero grid size-10 place-items-center rounded-xl text-primary-foreground shadow-card">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm leading-tight font-semibold text-sidebar-foreground">
              AI Workplace
            </p>
            <span className="text-[11px] text-muted-foreground">Productivity Assistant</span>
          </div>
        </div>

        <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:font-semibold data-[status=active]:text-sidebar-accent-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-border bg-surface-2 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <strong className="mb-1 block text-foreground">Responsible AI</strong>
          AI-generated content may contain errors. Review outputs carefully before using them for
          workplace decisions or communications.
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-border bg-card px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              className="text-foreground md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              onClick={toggle}
              className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              NN
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          {children}
          <footer className="mt-10 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
            Responsible AI: AI content may be inaccurate and should be reviewed before use.
          </footer>
        </main>
      </div>
    </div>
  );
}