"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-gold/20 text-charcoal"
                : "text-charcoal/70 hover:bg-beige-dark hover:text-charcoal",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r border-charcoal/10 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-charcoal/10 p-6">
            <Link href="/admin" className="font-serif text-xl font-semibold text-charcoal">
              Willora<span className="text-gold">Noor</span>
            </Link>
            <p className="mt-1 text-xs text-charcoal/50">Admin Panel</p>
          </div>
          <div className="flex-1 p-4">
            <NavLinks />
          </div>
          <div className="border-t border-charcoal/10 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex items-center border-b border-charcoal/10 bg-white p-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="border-b border-charcoal/10 p-6">
              <span className="font-serif text-xl font-semibold">
                Willora<span className="text-gold">Noor</span>
              </span>
            </div>
            <div className="p-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <span className="ml-3 font-serif text-lg font-semibold">Admin</span>
      </div>
    </>
  );
}
