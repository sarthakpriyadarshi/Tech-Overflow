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
  params: Promise<{ userId: string; userSlug: string }>;
}) => {
  const { userId } = await params;
  const user = await users.get<UserPrefs>(userId);
  const userAvatar = await avatars.getInitials(user.name, 200, 200);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white">
      {/* Radial Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto space-y-4 md:space-y-6 px-4 pb-12 md:pb-20 pt-24 md:pt-32">
        <GradientCard className="flex flex-col gap-4 md:gap-6 sm:flex-row p-4 md:p-6">
          <div className="w-24 sm:w-32 md:w-40 mx-auto sm:mx-0 shrink-0">
            <Image
              src={userAvatar || "/placeholder.svg"}
              width={200}
              height={200}
              alt={user.name}
              className="aspect-square w-full rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-0">
              <div className="space-y-1 md:space-y-2 text-center sm:text-left">
                <h1 className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-xl md:text-2xl lg:text-3xl font-bold text-transparent">
                  {user.name}
                </h1>
                <p className="text-base md:text-lg text-emerald-500/80">
                  {user.email}
                </p>
                <div className="flex flex-col gap-1 md:gap-2 text-xs md:text-sm text-gray-400">
                  <div className="flex items-center gap-1 md:gap-2 justify-center sm:justify-start">
                    <User className="h-3 w-3 md:h-4 md:w-4 text-emerald-500" />
                    <span>
                      Member since{" "}
                      {convertDateToRelativeTime(new Date(user.$createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 justify-center sm:justify-start">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-emerald-500" />
                    <span>
                      Last seen{" "}
                      {convertDateToRelativeTime(new Date(user.$updatedAt))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 mt-2 sm:mt-0">
                <EditButton />
              </div>
            </div>
          </div>
        </GradientCard>

        <div className="flex flex-col gap-4 md:gap-6 sm:flex-row min-h-[calc(100vh-24rem)]">
          <div className="w-full sm:w-auto">
            <GradientCard className="h-full p-2 md:p-4">
              <Navbar />
            </GradientCard>
          </div>

          <div className="flex-1">
            <GradientCard className="p-3 md:p-6">{children}</GradientCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
