import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ToastProvider from "@/_components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus Route Finder",
  description: "Built Using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <header>
            <nav>
              <div>
                <Link href="/">Home</Link>
              </div>
              <div>
                <Link href="/campus">Available Campus</Link>
              </div>
              <div>
                <Link href="/campus/new">Add Campus</Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
