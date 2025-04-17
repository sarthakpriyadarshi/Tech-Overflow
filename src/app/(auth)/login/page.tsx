"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    const loginResponse = await login(email.toString(), password.toString());
    if (loginResponse.error) {
      setError(loginResponse.error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative">
      {/* Radial Gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl z-0"></div>

      <div className="w-full max-w-md space-y-8 p-8 bg-white/5 rounded-xl backdrop-blur-lg border border-emerald-500/20 z-10">
        <div className="text-center">
          <h2 className="font-['Special_Gothic_Expanded_One'] text-3xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400 font-montserrat">
            Sign in to your account
          </p>
        </div>

        {error && (
          <p className="text-center text-red-500 font-montserrat text-sm">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-montserrat text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-white/5 border-emerald-500/20 focus:border-emerald-500 text-white"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-montserrat text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border-emerald-500/20 focus:border-emerald-500 text-white pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 font-montserrat text-lg transition-transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-gray-400 font-montserrat">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
