import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;

  const queries = [
    Query.equal("authorId", (await params).userId),
    Query.orderDesc("$createdAt"),
    Query.offset((+page - 1) * 25),
    Query.limit(25),
  ];

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1), // for optimization
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    })
  );

  return (
    <div className="space-y-6">
      <GradientCard hover={false} className="flex items-center justify-between">
        <p className="text-lg text-emerald-500/80">
          {questions.total} questions
        </p>
      </GradientCard>

      <div className="space-y-4">
        {questions.documents.map((ques) => (
          <div
            key={ques.$id}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <QuestionCard ques={ques} />
          </div>
        ))}
      </div>

      <Pagination total={questions.total} limit={25} />
    </div>
  );
};

export default Page;
