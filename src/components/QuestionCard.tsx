"use client";

import React from "react";
import Link from "next/link";
import type { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { GradientCard } from "./ui/gradient-card";
import Image from "next/image";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  console.log("Current Height:", height);
  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <GradientCard
      ref={ref}
      className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4"
    >
      <div className="relative shrink-0 text-xs md:text-sm sm:text-right flex sm:flex-col gap-3 sm:gap-1">
        <p className="text-emerald-400">{ques.totalVotes} votes</p>
        <p className="text-gray-400">{ques.totalAnswers} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <h2 className="text-lg md:text-xl font-semibold line-clamp-2">
            {ques.title}
          </h2>
        </Link>
        <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-emerald-500/10 px-2 py-0.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              #{tag}
            </Link>
          ))}
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0">
            <Image
              src={
                avatars.getInitials(ques.author.name, 24, 24) ||
                "/placeholder.svg"
              }
              width={24}
              height={24}
              alt={ques.author.name}
              className="rounded-lg border border-emerald-500/20 w-5 h-5 md:w-6 md:h-6"
            />
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Link
                href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                className="text-emerald-400 hover:text-emerald-300"
              >
                {ques.author.name}
              </Link>
              <span className="text-emerald-400/80">
                {ques.author.reputation}
              </span>
            </div>
          </div>
          <span className="text-gray-500 text-xs w-full sm:w-auto">
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </span>
        </div>
      </div>
    </GradientCard>
  );
};

export default QuestionCard;
