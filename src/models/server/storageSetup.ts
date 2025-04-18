import { Permission, Role } from "node-appwrite";
import { questionAttachmentBucket } from "@/models/name";
import { storage } from "@/models/server/config";

interface AppwriteError {
  code: number;
  response?: {
    type: string;
  };
}

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Connected");
  } catch (error: unknown) {
    const err = error as AppwriteError;
    if (
      err.code === 404 ||
      (err.response && err.response.type === "storage_bucket_not_found")
    ) {
      console.log("Bucket not found. Attempting to create a new bucket...");
      try {
        await storage.createBucket(
          questionAttachmentBucket,
          questionAttachmentBucket,
          [
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ],
          false,
          undefined,
          undefined,
          ["jpg", "png", "gif", "jpeg", "webp", "heic"]
        );
      } catch (createError: unknown) {
        const createErr = createError as AppwriteError;
        if (createErr.code === 409) {
          console.log("Bucket already exists. Continuing...");
        } else {
          console.error("Error creating storage bucket:", createErr);
        }
      }
    } else {
      console.error(
        "Error connecting to storage (not a missing bucket error):",
        error
      );
    }
  }
}
