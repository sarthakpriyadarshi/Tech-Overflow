"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { GradientCard } from "@/components/ui/gradient-card";
import { ChartBar, MessageSquare, ThumbsUp, Home } from "lucide-react";
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
    <GradientCard className="w-full sm:w-48" hover={false}>
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "hover:bg-emerald-500/10 hover:text-emerald-400"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </GradientCard>
  );
};

export default Navbar;
