"use client";

import React from "react";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { GradientCard } from "./ui/gradient-card";
import Image from "next/image";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  console.log("Current Height", height);
  return (
    <GradientCard ref={ref} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative shrink-0 text-sm sm:text-right space-y-1">
        <p className="text-emerald-400">{ques.totalVotes} votes</p>
        <p className="text-gray-400">{ques.totalAnswers} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <h2 className="text-xl font-semibold">{ques.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-emerald-500/10 px-2 py-0.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              #{tag}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Image
              src={avatars.getInitials(ques.author.name, 24, 24)}
              width={24}
              height={24}
              alt={ques.author.name}
              className="rounded-lg border border-emerald-500/20"
            />
            <div className="flex items-center gap-2">
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
          <span className="text-gray-500">
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </span>
        </div>
      </div>
    </GradientCard>
  );
};

export default QuestionCard;
