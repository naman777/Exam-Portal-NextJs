
"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/' && pathname !== '/signup' ;

  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray`}
        >
          <Toaster position="top-right" reverseOrder={false} />
          {showNavbar &&
          <Navbar />
          }
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
