"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserPrefs } from "@/store/Auth";
import { Loader2 } from "lucide-react";
import { account } from "@/models/client/config";

export default function CallbackPage() {
  const router = useRouter();
  const { setSessionData } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");
        const secret = urlParams.get("secret");
        if (userId && secret) {
          const session = await account.createSession(userId, secret);
          const user = await account.get<UserPrefs>();
          const { jwt } = await account.createJWT(); // Set JWT for future requests
          setSessionData({
            user,
            jwt,
            session,
          }); // Adjust according to store
          localStorage.setItem("jwt_token", jwt); // Optional
          router.replace("/");
        } else {
          setError("Missing userId or secret in callback.");
        }
      } catch (err) {
        setError("Failed to create session.");
        console.error("OAuth callback error:", err);
      }
    };

    handleOAuthCallback();
  }, [router, setSessionData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center text-white space-y-4">
        {error ? (
          <>
            <h2 className="text-xl font-bold text-red-500">{error}</h2>
            <p className="text-gray-400">Please try logging in again.</p>
          </>
        ) : (
          <>
            <Loader2 className="animate-spin h-8 w-8 mx-auto text-emerald-400" />
            <p className="text-gray-300">Finishing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}
