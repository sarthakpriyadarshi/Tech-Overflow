import React from "react";
import { Mail, Copyright } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] text-white py-4">
      <div className="relative z-10 container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-500/80">
          <Copyright className="h-4 w-4" />
          <span>
            2025 <Link href="/">Tech Overflow</Link>. All Rights Reserved.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-emerald-500" />
          <Link
            href="mailto:sarthakpriyadarshi01@gmail.com"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            sarthakpriyadarshi01@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
