import { Permission, Role } from "node-appwrite";
import { commentCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read(Role.any()),
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);
  console.log("Comment collection created successfully");

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
  ]);
  console.log("Comment collection attributes created successfully");
}
