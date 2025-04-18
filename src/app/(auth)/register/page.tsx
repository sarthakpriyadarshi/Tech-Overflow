"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { OAuthProvider } from "appwrite";

export default function Signup() {
  const { login, createAccount, oauthLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!username || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await createAccount(
      email.toString(),
      password.toString(),
      username.toString()
    );

    if (response.error) {
      setError(response.error.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(loginResponse.error.message);
      }
    }

    setIsLoading(false);
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    setIsLoading(true);
    setError("");

    try {
      // Use the oauthLogin method to initiate the OAuth flow
      await oauthLogin(provider);
    } catch (err) {
      setError("OAuth login failed.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative">
      {/* Radial Gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl z-0" />

      <div className="relative z-10 w-full max-w-md space-y-8 p-8 bg-white/5 rounded-xl backdrop-blur-lg border border-emerald-500/20">
        <div className="text-center">
          <h2 className="font-['Special_Gothic_Expanded_One'] text-3xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Join Tech Overflow
          </h2>
          <p className="mt-2 text-gray-400 font-montserrat">
            Create your account
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 text-center -mt-4">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-montserrat text-gray-300 mb-2"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Name"
              className="w-full bg-white/5 border-emerald-500/20 focus:border-emerald-500 text-white"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-montserrat text-gray-300 mb-2"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full bg-white/5 border-emerald-500/20 focus:border-emerald-500 text-white"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-montserrat text-gray-300 mb-2"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border-emerald-500/20 focus:border-emerald-500 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 font-montserrat text-lg transition-transform hover:scale-105"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={() => handleOAuth(OAuthProvider.Github)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-white text-black dark:bg-zinc-900 dark:text-white font-medium hover:opacity-90"
              >
                <IconBrandGithub className="h-5 w-5" />
                Sign Up with GitHub
              </Button>
            </div>
          </div>
        </form>

        <p className="text-center text-gray-400 font-montserrat">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
