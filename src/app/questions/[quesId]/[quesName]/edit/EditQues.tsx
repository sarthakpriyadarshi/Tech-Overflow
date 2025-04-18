"use client";

import QuestionForm from "@/components/AskPage";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const EditQues = ({ question }: { question: Models.Document }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (question.authorId !== user?.$id) {
      router.push(`/questions/${question.$id}/${slugify(question.title)}`);
    }
  }, [question, user, router]);

  if (user?.$id !== question.authorId) return null;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 flex flex-col items-center justify-start rounded-2xl">
      <div className="w-full max-w-3xl px-4">
        <QuestionForm
          question={{
            ...(question as Models.Document),
            title: question.title,
            content: question.content,
            tags: question.tags,
            authorId: question.authorId,
          }}
        />
      </div>
    </div>
  );
};

export default EditQues;
