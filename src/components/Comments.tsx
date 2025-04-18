"use client";

import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "./ui/textarea";

const Comments = ({
  comments: _comments,
  type,
  typeId,
  className,
}: {
  comments: Models.DocumentList<Models.Document>;
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = React.useState(_comments);
  const [newComment, setNewComment] = React.useState("");
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment || !user) return;

    try {
      const response = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment,
          authorId: user.$id,
          type: type,
          typeId: typeId,
        }
      );

      setNewComment(() => "");
      setComments((prev) => ({
        total: prev.total + 1,
        documents: [{ ...response, author: user }, ...prev.documents],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await databases.deleteDocument(db, commentCollection, commentId);

      setComments((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter(
          (comment) => comment.$id !== commentId
        ),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting comment");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {comments.documents.map((comment) => (
        <React.Fragment key={comment.$id}>
          <div className="border-t border-emerald-500/20 pt-2" />
          <div className="flex gap-2 group">
            <p className="text-sm text-gray-300">
              {comment.content} <span className="text-gray-500">–</span>{" "}
              <Link
                href={`/users/${comment.authorId}/${slugify(
                  comment.author.name
                )}`}
                className="text-emerald-400 hover:text-emerald-300"
              >
                {comment.author.name}
              </Link>{" "}
              <span className="text-gray-500">
                {convertDateToRelativeTime(new Date(comment.$createdAt))}
              </span>
            </p>
            {user?.$id === comment.authorId && (
              <button
                onClick={() => deleteComment(comment.$id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        </React.Fragment>
      ))}
      <div className="border-t border-emerald-500/20 pt-2" />
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Textarea
          className="min-h-[2.5rem] bg-black/20 border-emerald-500/20 resize-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(() => e.target.value)}
        />
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
        >
          Add Comment
        </Button>
      </form>
    </div>
  );
};

export default Comments;
