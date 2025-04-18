import { Permission, Role } from "node-appwrite";
import { answerCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";

export default async function createAnswerCollection() {
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.read(Role.any()),
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);
  console.log("Answer collection created successfully");

  await Promise.all([
    databases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ]);
  console.log("Answer collection attributes created successfully");
}
