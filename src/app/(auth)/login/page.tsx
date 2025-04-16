"use client";
import { useAuthStore } from "@/store/Auth";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    const { success, error } = await login(email, password);
    if (!success) {
      setError(error?.message || "Unknown error");
    }

    setIsLoading(false);
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-background to-background z-0"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-700/5 rounded-full blur-3xl"></div>

      {/* Code symbols floating animation */}
      <motion.div
        className="absolute text-green-500/10 text-7xl"
        initial={{ y: -20, x: "30vw", opacity: 0.3 }}
        animate={{ y: "60vh", opacity: 0.1 }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        &lt;/&gt;
      </motion.div>
      <motion.div
        className="absolute text-green-500/10 text-5xl"
        initial={{ y: "80vh", x: "60vw", opacity: 0.2 }}
        animate={{ y: "30vh", opacity: 0.1 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      >
        {}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-green-800/20 bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>

          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text font-comfortaa">
                Tech
              </span>
              <span className="font-comfortaa">Overflow</span>
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground/80">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="border-red-600/30 bg-red-950/30 text-red-400 backdrop-blur-sm"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-10 border-input/30 bg-background/50 focus:border-green-500 focus:ring-green-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-green-500 hover:text-green-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="pl-10 border-input/30 bg-background/50 focus:border-green-500 focus:ring-green-500/20 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white transition-all duration-300 shadow-lg shadow-green-900/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="relative flex items-center w-full">
              <div className="flex-grow border-t border-muted/30"></div>
              <span className="mx-4 flex-shrink text-muted-foreground/70 text-sm">
                OR
              </span>
              <div className="flex-grow border-t border-muted/30"></div>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-green-500 hover:text-green-400 font-medium transition-colors hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
