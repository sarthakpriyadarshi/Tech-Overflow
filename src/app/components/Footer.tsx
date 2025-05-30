import { Mail, Copyright } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] text-white py-4">
      <div className="relative z-10 container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="flex items-center gap-2 text-emerald-500/80 text-sm sm:text-base">
          <Copyright className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>
            2025 <Link href="/">Tech Overflow</Link>. All Rights Reserved.
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base">
          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
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
