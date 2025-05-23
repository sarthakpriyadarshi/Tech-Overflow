"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { type Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] =
    React.useState<Models.Document | null>(); // undefined means not fetched yet
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        setVotedDocument(() => response.documents[0] || null);
      }
    })();
  }, [user, id, type]);

  const toggleUpvote = async () => {
    if (!user) return router.push("/login");

    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "upvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message?: string }).message || "Something went wrong"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const toggleDownvote = async () => {
    if (!user) return router.push("/login");

    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "downvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message?: string }).message || "Something went wrong"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row md:flex-col items-center justify-start gap-x-2 gap-y-1 md:gap-y-2",
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 md:h-9 md:w-9 border-emerald-500/20 hover:bg-emerald-500/10",
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "text-emerald-400 border-emerald-500"
            : "text-gray-400"
        )}
        onClick={toggleUpvote}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <span className="text-base md:text-lg font-medium text-emerald-400">
        {voteResult}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 md:h-9 md:w-9 border-emerald-500/20 hover:bg-emerald-500/10",
          votedDocument && votedDocument.voteStatus === "downvoted"
            ? "text-emerald-400 border-emerald-500"
            : "text-gray-400"
        )}
        onClick={toggleDownvote}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoteButtons;
