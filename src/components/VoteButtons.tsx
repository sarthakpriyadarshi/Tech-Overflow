"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

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
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
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
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-start gap-y-2",
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "border-emerald-500/20 hover:bg-emerald-500/10",
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "text-emerald-400 border-emerald-500"
            : "text-gray-400"
        )}
        onClick={toggleUpvote}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium text-emerald-400">{voteResult}</span>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "border-emerald-500/20 hover:bg-emerald-500/10",
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
