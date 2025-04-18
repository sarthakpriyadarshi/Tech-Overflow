import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import Footer from "./components/Footer";
export const metadata: Metadata = {
  title: "Tech Overflow",
  description: "Your one-stop solution for all tech queries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.className,
          montserrat.className,
          "dark:bg-black dark:text-white max-h-fit"
        )}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
