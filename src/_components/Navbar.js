"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, MapPin, PlusCircle, Home } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/campus", label: "Explore Campuses", icon: MapPin },
  { href: "/campus/new", label: "Register Campus", icon: PlusCircle },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass-header shadow-lg shadow-black/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-primary/40 bg-primary/10 shadow-[0_0_12px_rgba(50,195,166,0.35)]">
            <Image
              src="/logo.png"
              alt="Campus Route Finder Logo"
              width={24}
              height={24}
              priority
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="font-bold tracking-tight text-foreground text-sm sm:text-base neon-text">
            Campus Route Finder
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/40 shadow-[0_0_12px_rgba(50,195,166,0.25)] font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-secondary/80 p-2 text-foreground shadow-sm hover:border-primary/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 flex">
          <div
            className="fixed inset-0 top-16 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative flex w-full max-w-xs flex-col glass-sidebar p-6 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center gap-2 pb-5 border-b border-border/70">
              <Compass className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground neon-text">
                Navigation Radar
              </span>
            </div>

            <nav className="mt-5 flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(50,195,166,0.4)]"
                        : "text-foreground bg-secondary/40 hover:bg-secondary border border-border/60 hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
