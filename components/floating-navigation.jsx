"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, User, Settings, FileText, Mail, Menu, X } from "lucide-react";

const menuItems = [
  { title: "Home", path: "/", icon: Home },
  { title: "About", path: "/about", icon: User },
  { title: "Blog", path: "/blog", icon: FileText },
  { title: "Contact", path: "/contact", icon: Mail },
  { title: "Settings", path: "/settings", icon: Settings },
];

export default function FloatingNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* close on escape */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* ---- Menu items ---- */}
      <div
        className={cn(
          "flex flex-col gap-1 transition-all duration-300",
          open
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant={active ? "default" : "secondary"}
              className={cn(
                "h-auto w-full justify-start gap-3 rounded px-4 py-3",
                "text-base font-medium" /* bigger text for boomers */,
              )}
            >
              <Link href={item.path} onClick={() => setOpen(false)}>
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            </Button>
          );
        })}
      </div>

      {/* ---- Toggle button ---- */}
      <Button
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg shadow-lg h-12 w-12"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}
