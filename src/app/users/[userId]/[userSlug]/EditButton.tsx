"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Edit } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const EditButton = () => {
  const { userId, userSlug } = useParams();
  const { user } = useAuthStore();

  if (user?.$id !== userId) return null;

  return (
    <Link href={`/users/${userId}/${userSlug}/edit`}>
      <Button
        variant="outline"
        className="group relative overflow-hidden border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:text-emerald-300"
      >
        <Edit className="mr-2 h-4 w-4" />
        <span>Edit Profile</span>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Button>
    </Link>
  );
};

export default EditButton;
