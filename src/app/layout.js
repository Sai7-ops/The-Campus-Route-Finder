import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/_components/ToastProvider";
import Navbar from "@/_components/Navbar";
import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus Route Finder | Precision Campus Navigation",
  description: "Real-time navigation, live tracking, and accessible multi-modal routing for academic campuses.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        <ToastProvider>
          <Navbar />

          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-border/50 bg-card/40 backdrop-blur-xs">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold tracking-tight text-foreground">
                    The Campus Route Finder
                  </span>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <Link href="/campus" className="hover:text-foreground transition-colors">
                    Campuses
                  </Link>
                  <Link href="/campus/new" className="hover:text-foreground transition-colors">
                    Add Campus
                  </Link>
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary/70" /> Precision Graph Engine
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} The Campus Route Finder. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}