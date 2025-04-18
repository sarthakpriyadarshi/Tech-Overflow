import { IndexType, Permission, Role } from "node-appwrite";

import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";

export default async function createQuestionCollection() {
  try {
    await databases.createCollection(
      db,
      questionCollection,
      questionCollection,
      [
        Permission.read(Role.any()),
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("Question collection created successfully.");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "collection_already_exists"
    ) {
      console.log("Question collection already exists.");
    } else {
      console.error("Error creating collection:", error);
      return;
    }
  }

  try {
    await Promise.all([
      databases.createStringAttribute(
        db,
        questionCollection,
        "title",
        100,
        true
      ),
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
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "attribute_already_exists"
    ) {
      console.log("Some attributes already exist.");
    } else {
      console.error("Error creating attributes:", error);
    }
  }

  try {
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
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "index_already_exists"
    ) {
      console.log("Index already exists.");
    } else {
      console.error("Error creating index:", error);
    }
  }
}
