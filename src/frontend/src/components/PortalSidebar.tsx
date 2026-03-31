import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  id: string;
}

interface PortalSidebarProps {
  portalRole: string;
  roleColor: string;
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function PortalSidebar({
  portalRole,
  roleColor,
  items,
  activeItem,
  onItemClick,
}: PortalSidebarProps) {
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/kps-crest-transparent.dim_120x120.png"
            alt="KPS"
            className="h-8 w-8 object-contain"
          />
          <div>
            <div
              className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: "#C9A45A" }}
            >
              KPS Portal
            </div>
            <div className="text-xs text-white/60">{portalRole}</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`sidebar.${item.id}.link`}
            onClick={() => {
              onItemClick(item.id);
              setMobileOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-150",
              activeItem === item.id
                ? "text-white"
                : "text-white/60 hover:text-white hover:bg-white/10",
            )}
            style={
              activeItem === item.id ? { background: `${roleColor}cc` } : {}
            }
          >
            <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <Button
          type="button"
          data-ocid="sidebar.logout.button"
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 min-h-screen"
        style={{ background: "#0E2E40" }}
      >
        <SidebarContent />
      </aside>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: "#0E2E40" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative flex flex-col w-64"
            style={{ background: "#0E2E40" }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
