"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Search, MessageSquare, User, Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-['Special_Gothic_Expanded_One'] bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Tech Overflow
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat"
            >
              <Home className="inline-block w-5 h-5 mr-2" />
              Home
            </Link>
            <Link
              href="/questions"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat"
            >
              <MessageSquare className="inline-block w-5 h-5 mr-2" />
              Questions
            </Link>
            <Link
              href="/search"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat"
            >
              <Search className="inline-block w-5 h-5 mr-2" />
              Search
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors font-montserrat"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors font-montserrat"
                  onClick={() => logout()}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-500 font-montserrat"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-montserrat">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden">
            <Menu className="w-6 h-6 text-gray-300" />
          </Button>
        </div>
      </div>
    </header>
  );
}
