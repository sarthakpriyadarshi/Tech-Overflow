import { IndexType, Permission, Role } from "node-appwrite";

import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";

export default async function createQuestionCollection() {
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read(Role.any()),
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);
  console.log("Question collection created successfully.");

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);
  console.log("Question collection attributes created successfully.");

  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ["asc"]
    ),
  ]);
}
