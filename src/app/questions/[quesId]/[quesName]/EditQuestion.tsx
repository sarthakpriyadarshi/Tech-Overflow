"use client";

import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { PenLine } from "lucide-react";
import Link from "next/link";

const EditQuestion = ({
  questionId,
  questionTitle,
  authorId,
}: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}) => {
  const { user } = useAuthStore();

  return user?.$id === authorId ? (
    <Link
      href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/40 p-1 text-emerald-400 duration-200 hover:bg-emerald-500/10 transition-all transform hover:scale-110"
      title="Edit question"
    >
      <PenLine className="h-4 w-4" />
    </Link>
  ) : null;
};

export default EditQuestion;
