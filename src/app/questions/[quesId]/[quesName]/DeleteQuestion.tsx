"use client";

import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const DeleteQuestion = ({
  questionId,
  authorId,
}: {
  questionId: string;
  authorId: string;
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const deleteQuestion = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await databases.deleteDocument(db, questionCollection, questionId);
      toast.success("Question deleted successfully");
      router.push("/questions");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return user?.$id === authorId ? (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10 transition-all transform hover:scale-110"
      onClick={deleteQuestion}
      title="Delete question"
    >
      <Trash className="h-4 w-4" />
    </button>
  ) : null;
};

export default DeleteQuestion;
