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

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const pageStr = (await searchParams)?.page;
  const page = pageStr ? Number.parseInt(pageStr, 10) : 1;

  const queries = [
    Query.equal("authorId", (await params).userId),
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
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
    <div className="space-y-4 md:space-y-6">
      <GradientCard
        hover={false}
        className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 md:p-4"
      >
        <p className="text-base md:text-lg text-emerald-500/80 font-semibold">
          You answered total of:{" "}
        </p>
        <p className="text-base md:text-lg text-emerald-500/80">
          {answers.total} answers
        </p>
      </GradientCard>

      <div className="space-y-3 md:space-y-4">
        {answers.documents.map((ans) => (
          <GradientCard
            key={ans.$id}
            className="space-y-3 md:space-y-4 p-3 md:p-4"
          >
            <p className="text-base md:text-lg text-emerald-500/80 font-semibold">
              Question:
            </p>
            <div className="max-h-32 md:max-h-40 overflow-auto rounded-lg bg-black/20 p-3 md:p-6 text-sm md:text-base">
              <MarkdownPreview source={ans.question.title} />
            </div>
            <Link
              href={`/questions/${ans.questionId}/${slugify(
                ans.question.title
              )}`}
            >
              <Button className="group relative overflow-hidden border-emerald-500/20 text-white font-bold hover:border-emerald-500/40 hover:text-emerald-300 text-xs md:text-sm h-8 md:h-10 w-full sm:w-auto">
                <MessageSquare className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
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
