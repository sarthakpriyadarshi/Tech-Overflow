import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "@/models/name";
import { storage } from "@/models/server/config";

export default async function createStorageCollection() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Connected");
  } catch (error) {
    console.error("Error connecting to storage:", error);
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.create("users"),
          Permission.read("any"),
          Permission.read("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
    } catch (error) {
      console.error("Error creating storage bucket:", error);
    }
  }
}
