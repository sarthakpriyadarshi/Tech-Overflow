import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { GradientCard } from "@/components/ui/gradient-card";
import { Clock, User } from "lucide-react";
import Image from "next/image";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string; userSlug: string };
}) => {
  const user = await users.get<UserPrefs>(params.userId);
  const userAvatar = await avatars.getInitials(user.name, 200, 200);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white">
      {/* Radial Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto space-y-6 px-4 pb-20 pt-32">
        <GradientCard className="flex flex-col gap-6 sm:flex-row">
          <div className="w-40 shrink-0">
            <Image
              src={userAvatar}
              width={200}
              height={200}
              alt={user.name}
              className="aspect-square w-full rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent">
                  {user.name}
                </h1>
                <p className="text-lg text-emerald-500/80">{user.email}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    <span>
                      Member since{" "}
                      {convertDateToRelativeTime(new Date(user.$createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span>
                      Last seen{" "}
                      {convertDateToRelativeTime(new Date(user.$updatedAt))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <EditButton />
              </div>
            </div>
          </div>
        </GradientCard>

        <div className="flex flex-col gap-6 sm:flex-row min-h-[calc(100vh-24rem)]">
          <GradientCard className="h-full">
            <Navbar />
          </GradientCard>

          <div className="flex-1">
            <GradientCard>{children}</GradientCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
