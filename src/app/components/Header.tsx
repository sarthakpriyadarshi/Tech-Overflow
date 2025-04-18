"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Home,
  Search,
  MessageSquare,
  User,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-['Special_Gothic_Expanded_One'] bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Tech Overflow
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat text-sm lg:text-base"
            >
              <Home className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              Home
            </Link>
            <Link
              href="/questions"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat text-sm lg:text-base"
            >
              <MessageSquare className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              Questions
            </Link>
            <Link
              href="/search"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-montserrat text-sm lg:text-base"
            >
              <Search className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              Search
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-300 hover:text-emerald-400 transition-colors font-montserrat text-sm lg:text-base"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-300 hover:text-emerald-400 transition-colors font-montserrat text-sm lg:text-base"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-500 font-montserrat text-sm lg:text-base py-1 h-8 lg:h-10"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-montserrat text-sm lg:text-base py-1 h-8 lg:h-10">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden p-1 h-8 w-8"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-300" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50  backdrop-blur-sm md:hidden transition-opacity",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-screen w-64 bg-black/50 backdrop-blur-3xl border border-black md:hidden transform transition-transform duration-200 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-4">
            <Button
              variant="ghost"
              className="ml-auto block p-1 h-8 w-8"
              onClick={toggleMobileMenu}
            >
              <X className="w-5 h-5 text-gray-300" />
            </Button>
          </div>

          <nav className="flex flex-col px-4 py-2">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/questions"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Questions</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>
          </nav>

          <div className="mt-auto p-4 border-t border-gray-800">
            {user ? (
              <>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors justify-start"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full text-emerald-400 hover:text-emerald-500"
                  >
                    Log in
                  </Button>
                </Link>
                <Link
                  href="/register"
                  className="block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
