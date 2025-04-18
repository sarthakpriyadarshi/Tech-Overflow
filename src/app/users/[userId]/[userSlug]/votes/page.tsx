import Pagination from "@/components/Pagination";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import type React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams: Promise<{
    page?: string;
    voteStatus?: "upvoted" | "downvoted";
  }>;
}) => {
  (await searchParams).page ||= "1";

  const VoteFilter = ({
    isActive,
    href,
    children,
  }: {
    isActive: boolean;
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 md:gap-2 rounded-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm transition-all duration-300 ${
        isActive
          ? "bg-emerald-500/20 text-emerald-400"
          : "hover:bg-emerald-500/10 hover:text-emerald-400"
      }`}
    >
      {children}
    </Link>
  );

  const query = [
    Query.equal("votedById", (await params).userId),
    Query.orderDesc("$createdAt"),
    Query.offset(
      (((await searchParams)?.page
        ? +((await searchParams)?.page as string)
        : 1) -
        1) *
        25
    ),
    Query.limit(25),
  ];

  const voteStatus = (await searchParams).voteStatus;
  if (voteStatus !== undefined) {
    query.push(Query.equal("voteStatus", voteStatus));
  }

  const votes = await databases.listDocuments(db, voteCollection, query);

  votes.documents = await Promise.all(
    votes.documents.map(async (vote) => {
      const questionOfTypeQuestion =
        vote.type === "question"
          ? await databases.getDocument(db, questionCollection, vote.typeId, [
              Query.select(["title"]),
            ])
          : null;

      if (questionOfTypeQuestion) {
        return {
          ...vote,
          question: questionOfTypeQuestion,
        };
      }

      const answer = await databases.getDocument(
        db,
        answerCollection,
        vote.typeId
      );
      const questionOfTypeAnswer = await databases.getDocument(
        db,
        questionCollection,
        answer.questionId,
        [Query.select(["title"])]
      );

      return {
        ...vote,
        question: questionOfTypeAnswer,
      };
    })
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <GradientCard
        hover={false}
        className="flex flex-col sm:flex-row gap-3 justify-between items-center p-3 md:p-4"
      >
        <p className="text-base md:text-lg text-emerald-500/80">
          {votes.total} votes
        </p>
        <nav className="flex flex-wrap gap-1 md:gap-2 justify-center">
          <VoteFilter
            href={`/users/${(await params).userId}/${
              (await params).userSlug
            }/votes`}
            isActive={!(await searchParams).voteStatus}
          >
            All
          </VoteFilter>
          <VoteFilter
            href={`/users/${(await params).userId}/${
              (await params).userSlug
            }/votes?voteStatus=upvoted`}
            isActive={(await searchParams).voteStatus === "upvoted"}
          >
            <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" /> Upvotes
          </VoteFilter>
          <VoteFilter
            href={`/users/${(await params).userId}/${
              (await params).userSlug
            }/votes?voteStatus=downvoted`}
            isActive={(await searchParams).voteStatus === "downvoted"}
          >
            <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" /> Downvotes
          </VoteFilter>
        </nav>
      </GradientCard>

      <div className="space-y-3 md:space-y-4">
        {votes.documents.map((vote) => (
          <GradientCard key={vote.$id} className="space-y-2 p-3 md:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
              <span
                className={`inline-flex items-center gap-1 md:gap-2 rounded-lg px-2 md:px-3 py-1 text-xs md:text-sm ${
                  vote.voteStatus === "upvoted"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {vote.voteStatus === "upvoted" ? (
                  <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" />
                )}
                {vote.voteStatus}
              </span>
              <Link
                href={`/questions/${vote.question.$id}/${slugify(
                  vote.question.title
                )}`}
                className="group flex items-center gap-1 md:gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm md:text-base line-clamp-2"
              >
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                {vote.question.title}
              </Link>
            </div>
            <p className="text-right text-xs md:text-sm text-emerald-500/60">
              {convertDateToRelativeTime(new Date(vote.$createdAt))}
            </p>
          </GradientCard>
        ))}
      </div>

      <Pagination total={votes.total} limit={25} />
    </div>
  );
};

export default Page;
