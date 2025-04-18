"use client";

import type { Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { avatars } from "@/models/client/config";
import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Button } from "./ui/button";
import { GradientCard } from "./ui/gradient-card";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const Answers = ({
  answers: _answers,
  questionId,
}: {
  answers: Models.DocumentList<Models.Document>;
  questionId: string;
}) => {
  const [answers, setAnswers] = React.useState(_answers);
  const [newAnswer, setNewAnswer] = React.useState("");
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAnswer || !user) return;
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: questionId,
          answer: newAnswer,
          authorId: user.$id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setNewAnswer(() => "");
      setAnswers((prev) => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user,
            upvotesDocuments: { documents: [], total: 0 },
            downvotesDocuments: { documents: [], total: 0 },
            comments: { documents: [], total: 0 },
          },
          ...prev.documents,
        ],
      }));
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message?: string }).message || "Error creating answer"
        );
      } else {
        toast.error("Error creating answer");
      }
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      const response = await fetch("/api/answer", {
        method: "DELETE",
        body: JSON.stringify({
          answerId: answerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setAnswers((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((answer) => answer.$id !== answerId),
      }));
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message?: string }).message || "Error deleting answer"
        );
      } else {
        toast.error("Error deleting answer");
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        {answers.total} Answers
      </h2>
      {answers.documents.map((answer) => (
        <GradientCard
          key={answer.$id}
          className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4"
        >
          <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-4 md:shrink-0">
            <VoteButtons
              type="answer"
              id={answer.$id}
              upvotes={answer.upvotesDocuments}
              downvotes={answer.downvotesDocuments}
            />
            {user?.$id === answer.authorId && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => deleteAnswer(answer.$id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="w-full overflow-auto">
            <MarkdownPreview
              className="prose prose-invert max-w-none rounded-xl bg-black/20 p-3 md:p-4 prose-sm md:prose-base"
              source={answer.content}
            />
            <div className="mt-3 md:mt-4 flex items-center justify-end gap-2">
              <Image
                src={
                  avatars.getInitials(answer.author.name, 36, 36) ||
                  "/placeholder.svg"
                }
                width={36}
                height={36}
                alt={answer.author.name}
                className="rounded-lg border border-emerald-500/20 w-7 h-7 md:w-9 md:h-9"
              />
              <div className="text-right">
                <Link
                  href={`/users/${answer.author.$id}/${slugify(
                    answer.author.name
                  )}`}
                  className="text-emerald-400 hover:text-emerald-300 font-medium text-sm md:text-base"
                >
                  {answer.author.name}
                </Link>
                <p className="text-xs md:text-sm text-gray-400">
                  reputation:{" "}
                  <span className="text-emerald-400">
                    {answer.author.reputation}
                  </span>
                </p>
              </div>
            </div>
            <Comments
              comments={answer.comments}
              className="mt-3 md:mt-4"
              type="answer"
              typeId={answer.$id}
            />
            <div className="my-3 md:my-4 border-t border-emerald-500/20" />
          </div>
        </GradientCard>
      ))}
      <div className="border-t border-emerald-500/20 pt-4 md:pt-6">
        {/* Add onSubmit only to the form element, not individual buttons */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Your Answer
          </h2>
          <RTE
            value={newAnswer}
            onChange={(value) => setNewAnswer(() => value || "")}
          />
          {/* Explicitly add type="submit" to the submit button */}
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          >
            Post Your Answer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Answers;
