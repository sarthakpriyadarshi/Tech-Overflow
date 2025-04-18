import { databases, users } from "@/models/server/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { PlusCircle, Sparkles } from "lucide-react";

const Page = async ({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string; search?: string };
}) => {
  const page = parseInt(searchParams.page || "1", 10);

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

  if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
  if (searchParams.search)
    queries.push(
      Query.or([
        Query.search("title", searchParams.search),
        Query.search("content", searchParams.search),
      ])
    );

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  // Enrich with author, votes, and answers
  const enrichedQuestions = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-xl bg-white/5 border border-emerald-500/20 p-8 backdrop-blur-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <h1 className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent">
                  All Questions
                </h1>
              </div>
              <p className="text-gray-400">
                {questions.total} questions in our community
              </p>
            </div>

            <Link href="/questions/ask">
              <Button className="w-full md:w-auto relative group bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105">
                <PlusCircle className="mr-2 h-5 w-5" />
                Ask a Question
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              </Button>
            </Link>
          </div>
          <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-8 backdrop-blur-lg">
            {/* Search Section */}
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-8 backdrop-blur-lg">
              <Search />
            </div>

            {/* Questions List */}
            <div className="space-y-6 mt-8">
              <div className="space-y-4">
                {enrichedQuestions.map((ques) => (
                  <div
                    key={ques.$id}
                    className="transform transition-all duration-300"
                  >
                    <QuestionCard ques={ques} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <Pagination total={questions.total} limit={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
