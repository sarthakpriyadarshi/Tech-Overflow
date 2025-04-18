const Page = async ({
  params,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
}) => {
  const { userId } = await params;
  console.log(userId);
  // 1) await the entire params promise
  // const { userId } = await params;

  // const [user, questions, answers] = await Promise.all([
  //   users.get<UserPrefs>(userId),
  //   databases.listDocuments(db, questionCollection, [
  //     Query.equal("authorId", userId),
  //     Query.limit(1),
  //   ]),
  //   databases.listDocuments(db, answerCollection, [
  //     Query.equal("authorId", userId),
  //     Query.limit(1),
  //   ]),
  // ]);

  // console.log("User pref reputation", user.prefs.reputation);

  // const stats = [
  //   {
  //     title: "Reputation",
  //     value: user.prefs.reputation || 0,
  //     icon: Trophy,
  //     gradient: "from-emerald-500/20 to-teal-500/20",
  //   },
  //   {
  //     title: "Questions Asked",
  //     value: questions.total || 0,
  //     icon: MessageSquare,
  //     gradient: "from-emerald-500/20 to-teal-500/20",
  //   },
  //   {
  //     title: "Answers Given",
  //     value: answers.total || 0,
  //     icon: MessageCircle,
  //     gradient: "from-emerald-500/20 to-teal-500/20",
  //   },
  // ];

  // return (
  //   <div className="grid gap-6 md:grid-cols-3">
  //     {stats.map((stat) => (
  //       <GradientCard
  //         key={stat.title}
  //         className="group flex flex-col items-center justify-center py-8"
  //       >
  //         <div className="mb-4 rounded-full bg-emerald-500/10 p-3 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
  //           <stat.icon className="h-6 w-6" />
  //         </div>
  //         <h2 className="mb-2 text-lg font-medium text-gray-200">
  //           {stat.title}
  //         </h2>
  //         <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
  //           <NumberTicker value={stat.value} />
  //         </p>
  //         <div
  //           className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`}
  //         />
  //       </GradientCard>
  //     ))}
  //   </div>
  // );
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        Edit Profile
      </h1>
      <p className="text-sm md:text-base text-gray-300">
        Update your profile information below.
      </p>
      <div className="h-40 flex items-center justify-center bg-black/20 rounded-lg">
        <p className="text-gray-400">Edit form coming soon...</p>
      </div>
    </div>
  );
};

export default Page;
