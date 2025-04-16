import env from "@/app/env";

import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apiKey);

// Initialize Appwrite services
const users = new Users(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { client, users, databases, storage, avatars };
