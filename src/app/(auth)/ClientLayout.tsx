"use client";

import { Inter, Comfortaa } from "next/font/google";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  display: "swap",
  variable: "--font-inter",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-comfortaa",
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background">
        <div
          className={`${inter.variable} ${comfortaa.variable} font-sans antialiased`}
        >
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
