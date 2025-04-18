"use client";

import { Models } from "appwrite";
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
    } catch (error: any) {
      window.alert(error?.message || "Error creating answer");
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
    } catch (error: any) {
      window.alert(error?.message || "Error deleting answer");
    }
  };

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        {answers.total} Answers
      </h2>
      {answers.documents.map((answer) => (
        <GradientCard key={answer.$id} className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">
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
                className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => deleteAnswer(answer.$id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="w-full overflow-auto">
            <MarkdownPreview
              className="prose prose-invert max-w-none rounded-xl bg-black/20 p-4"
              source={answer.content}
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Image
                src={avatars.getInitials(answer.author.name, 36, 36)}
                width={36}
                height={36}
                alt={answer.author.name}
                className="rounded-lg border border-emerald-500/20"
              />
              <div className="text-right">
                <Link
                  href={`/users/${answer.author.$id}/${slugify(
                    answer.author.name
                  )}`}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {answer.author.name}
                </Link>
                <p className="text-sm text-gray-400">
                  reputation:{" "}
                  <span className="text-emerald-400">
                    {answer.author.reputation}
                  </span>
                </p>
              </div>
            </div>
            <Comments
              comments={answer.comments}
              className="mt-4"
              type="answer"
              typeId={answer.$id}
            />
            <div className="my-4 border-t border-emerald-500/20" />
          </div>
        </GradientCard>
      ))}
      <div className="border-t border-emerald-500/20 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Your Answer
          </h2>
          <RTE
            value={newAnswer}
            onChange={(value) => setNewAnswer(() => value || "")}
          />
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
            Post Your Answer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Answers;
