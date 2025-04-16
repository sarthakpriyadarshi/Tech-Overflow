import { db } from "@/models/name";
import { databases } from "@/models/server/config";

import createAnswerCollection from "@/models/server/answer.collection";
import createCommentCollection from "@/models/server/comment.collection";
import createQuestionCollection from "@/models/server/question.collection";
import getOrCreateStorage from "@/models/server/storageSetup";
import createVoteCollection from "@/models/server/vote.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch (error) {
    console.log("Database not found, creating a new one...", error);
    try {
      await databases.create(db, db);
      console.log("Database created");
      await Promise.all([
        createAnswerCollection(),
        createCommentCollection(),
        createQuestionCollection(),
        getOrCreateStorage(),
        createVoteCollection(),
      ]);
      console.log("Collections created");
      console.log("Database connected!");
    } catch (error) {
      console.error("Error creating database or collections:", error);
    }
  }
  return databases;
}
