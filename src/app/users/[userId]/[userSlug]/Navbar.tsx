"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  BarChartIcon as ChartBar,
  MessageSquare,
  ThumbsUp,
  Home,
} from "lucide-react";
import React from "react";

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();

  const items = [
    {
      name: "Summary",
      href: `/users/${userId}/${userSlug}`,
      icon: Home,
    },
    {
      name: "Questions",
      href: `/users/${userId}/${userSlug}/questions`,
      icon: MessageSquare,
    },
    {
      name: "Answers",
      href: `/users/${userId}/${userSlug}/answers`,
      icon: ChartBar,
    },
    {
      name: "Votes",
      href: `/users/${userId}/${userSlug}/votes`,
      icon: ThumbsUp,
    },
  ];

  return (
    <nav className="w-full">
      <div className="flex sm:flex-col gap-1 md:gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-1 md:gap-2 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "hover:bg-emerald-500/10 hover:text-emerald-400"
              }`}
            >
              <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
