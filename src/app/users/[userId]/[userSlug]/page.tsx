import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { GradientCard } from "@/components/ui/gradient-card";
import { Trophy, MessageSquare, MessageCircle } from "lucide-react";

const Page = async ({
  params,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
}) => {
  // 1) await the entire params promise
  const { userId } = await params;

  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", userId),
      Query.limit(1),
    ]),
  ]);

  const stats = [
    {
      title: "Reputation",
      value: user.prefs.reputation || 0,
      icon: Trophy,
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Questions Asked",
      value: questions.total || 0,
      icon: MessageSquare,
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Answers Given",
      value: answers.total || 0,
      icon: MessageCircle,
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
  ];

  return (
    <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => (
        <GradientCard
          key={stat.title}
          className="group flex flex-col items-center justify-center py-4 md:py-8"
        >
          <div className="mb-2 md:mb-4 rounded-full bg-emerald-500/10 p-2 md:p-3 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
            <stat.icon className="h-4 w-4 md:h-6 md:w-6" />
          </div>
          <h2 className="mb-1 md:mb-2 text-base md:text-lg font-medium text-gray-200">
            {stat.title}
          </h2>
          <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            <NumberTicker value={stat.value} />
          </p>
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`}
          />
        </GradientCard>
      ))}
    </div>
  );
};

export default Page;
