import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { cn } from "@/lib/utils";

function getInitials(fullName: string | undefined, email: string) {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

type UserProfileMenuProps = {
  className?: string;
  variant?: "default" | "navbar";
  onNavigate?: () => void;
};

export function UserProfileMenu({
  className,
  variant = "default",
  onNavigate,
}: UserProfileMenuProps) {
  const { user, signOut } = usePortalAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  if (!user) return null;

  const displayName = user.fullName ?? user.email.split("@")[0];
  const initials = getInitials(user.fullName, user.email);
  const isNavbar = variant === "navbar";

  const items = [
    { label: "Settings", icon: Settings, to: "/settings" },
    { label: "Edit profile", icon: User, to: "/profile" },
  ] as const;

  const handleSignOut = async () => {
    setOpen(false);
    onNavigate?.();
    await signOut();
    navigate("/");
  };

  const closeMenu = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "touch-target flex items-center justify-center rounded-full bg-accent font-semibold text-white",
          "transition-opacity hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2",
          isNavbar ? "h-11 w-11 text-xs shadow-sm shadow-accent/30" : "h-11 w-11 text-sm shadow-sm shadow-accent/30",
          open && "ring-2 ring-accent/30 ring-offset-2"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-white py-1.5 shadow-lg z-50"
        >
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>

          {items.map(({ label, icon: Icon, to }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground active:bg-muted/30 transition-colors"
            >
              <Icon size={16} className="text-muted" />
              {label}
            </Link>
          ))}

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-600 active:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
