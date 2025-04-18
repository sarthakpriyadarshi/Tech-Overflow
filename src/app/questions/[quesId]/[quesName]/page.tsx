import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { avatars } from "@/models/client/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import type { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { Button } from "@/components/ui/button";

const Page = async ({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  const { quesId } = await params;
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  // since it is dependent on the question, we fetch it here outside of the Promise.all
  const author = await users.get<UserPrefs>(question.authorId);

  // Process comments and answers
  const [processedComments, processedAnswers] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [author, comments, upvotes, downvotes] = await Promise.all([
          users.get<UserPrefs>(answer.authorId),
          databases.listDocuments(db, commentCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
          ]),
        ]);

        const processedComments = await Promise.all(
          comments.documents.map(async (comment) => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          })
        );

        return {
          ...answer,
          comments: { ...comments, documents: processedComments },
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    ),
  ]);

  // Update the documents with processed data
  comments.documents = processedComments;
  answers.documents = processedAnswers;

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pb-20 pt-24 md:pt-36">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full">
            <h1 className="mb-1 text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              {question.title}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
              <span className="flex items-center">
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span className="flex items-center">
                {answers.total} {answers.total === 1 ? "Answer" : "Answers"}
              </span>
              <span className="flex items-center">
                {upvotes.total + downvotes.total}{" "}
                {upvotes.total + downvotes.total === 1 ? "Vote" : "Votes"}
              </span>
            </div>
          </div>
          <Link
            href="/questions/ask"
            className="mt-4 md:mt-0 md:ml-auto inline-block shrink-0"
          >
            <Button className="shadow-2xl w-full md:w-auto">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Ask a question
              </span>
            </Button>
          </Link>
        </div>
        <hr className="my-4 border-emerald-500/20" />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col flex-row justify-center md:justify-start items-center md:items-center gap-4 md:shrink-0">
            <VoteButtons
              type="question"
              id={question.$id}
              className="w-full"
              upvotes={upvotes}
              downvotes={downvotes}
            />
            <div className="flex flex-row md:flex-col gap-4">
              <EditQuestion
                questionId={question.$id}
                questionTitle={question.title}
                authorId={question.authorId}
              />
              <DeleteQuestion
                questionId={question.$id}
                authorId={question.authorId}
              />
            </div>
          </div>
          <div className="w-full overflow-auto">
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-6 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/8">
              <MarkdownPreview
                className="rounded-xl p-2 md:p-4"
                source={question.content}
              />
              {question.attachmentId && (
                <picture>
                  <img
                    src={
                      storage.getFilePreview(
                        questionAttachmentBucket,
                        question.attachmentId
                      ) || "/placeholder.svg"
                    }
                    alt={question.title}
                    className="mt-3 rounded-lg w-full"
                  />
                </picture>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
              {question.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/questions?tag=${tag}`}
                  className="inline-block rounded-lg bg-emerald-500/20 px-2 md:px-3 py-1 text-emerald-400 duration-200 hover:bg-emerald-500/30 transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 rounded-xl bg-transparent">
              <picture>
                <img
                  src={
                    avatars.getInitials(author.name, 36, 36) ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={author.name}
                  className="rounded-lg w-8 h-8 md:w-9 md:h-9"
                />
              </picture>
              <div className="block leading-tight">
                <Link
                  href={`/users/${author.$id}/${slugify(author.name)}`}
                  className="text-sm md:text-base text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {author.name}
                </Link>
                <p className="text-xs md:text-sm text-gray-400">
                  <strong className="text-white">
                    {author.prefs.reputation}
                  </strong>{" "}
                  reputation
                </p>
              </div>
            </div>
            <Comments
              comments={comments}
              className="mt-4"
              type="question"
              typeId={question.$id}
            />
            <hr className="my-4 border-emerald-500/20" />
          </div>
        </div>
        <Answers answers={answers} questionId={question.$id} />
      </div>
    </div>
  );
};

export default Page;
