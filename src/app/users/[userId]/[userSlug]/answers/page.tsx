import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: { userId: string; userSlug: string };
  searchParams: { page?: string };
}) => {
  searchParams.page ||= "1";

  const queries = [
    Query.equal("authorId", params.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((+searchParams.page - 1) * 25),
    Query.limit(25),
  ];

  const answers = await databases.listDocuments(db, answerCollection, queries);

  answers.documents = await Promise.all(
    answers.documents.map(async (ans) => {
      const question = await databases.getDocument(
        db,
        questionCollection,
        ans.questionId,
        [Query.select(["title"])]
      );
      return { ...ans, question };
    })
  );

  return (
    <div className="space-y-6">
      <GradientCard hover={false} className="flex items-center justify-between">
        <p className="text-lg text-emerald-500/80">{answers.total} answers</p>
      </GradientCard>

      <div className="space-y-4">
        {answers.documents.map((ans) => (
          <GradientCard key={ans.$id} className="space-y-4">
            <div className="max-h-40 overflow-auto rounded-lg bg-black/20 p-6">
              <MarkdownPreview source={ans.content} />
            </div>
            <Link
              href={`/questions/${ans.questionId}/${slugify(
                ans.question.title
              )}`}
            >
              <Button className="group relative overflow-hidden border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:text-emerald-300">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>View Question</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </Link>
          </GradientCard>
        ))}
      </div>

      <Pagination total={answers.total} limit={25} />
    </div>
  );
};

export default Page;
