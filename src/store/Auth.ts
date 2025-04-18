import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models, OAuthProvider } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;
  setHydrated(): void;
  setSessionData(data: {
    session: Models.Session | null;
    user: Models.User<UserPrefs> | null;
    jwt: string | null;
  }): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
  oauthLogin(provider: OAuthProvider): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      setHydrated() {
        set({
          hydrated: true,
        });
      },
      setSessionData(data) {
        set(data);
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.error("Error verifying session:", error);
        }
      },
      async login(email, password) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.error("Error logging in:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async createAccount(email, password, name) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.error("Error creating account:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async logout() {
        try {
          await account.deleteSession("current");
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },
      async oauthLogin(provider: OAuthProvider) {
        try {
          const redirectUrl = await account.createOAuth2Token(
            provider,
            `${window.location.origin}/callback`,
            `${window.location.origin}/login`
          );
          if (typeof redirectUrl === "string") {
            window.location.href = redirectUrl;
          } else {
            throw new Error("OAuth provider did not return a redirect URL.");
          }
        } catch (err) {
          console.error("OAuth login error:", err);
          throw new Error("OAuth login failed.");
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            state?.setHydrated();
          }
        };
      },
    }
  )
);
