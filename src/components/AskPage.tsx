"use client";
import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Eye, Tags, Send } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import EditorToolbar from "@/components/editor/EditorToolbar";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { useRouter } from "next/navigation";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { ID, Permission, Role } from "appwrite";

type Question = {
  $id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string;
};

const AskPage = ({ question }: { question?: Question }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  // form state
  const [title, setTitle] = useState(question?.title || "");
  const [content, setContent] = useState(question?.content || "");
  const [tags, setTags] = useState<string[]>(question?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEditorAction = (action: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    let newText = "";

    switch (action) {
      case "**":
        newText =
          text.substring(0, start) +
          "**" +
          text.substring(start, end) +
          "**" +
          text.substring(end);
        break;
      case "*":
        newText =
          text.substring(0, start) +
          "*" +
          text.substring(start, end) +
          "*" +
          text.substring(end);
        break;
      case "[":
        newText =
          text.substring(0, start) +
          "[" +
          text.substring(start, end) +
          "](url)" +
          text.substring(end);
        break;
      case "1.":
        newText = text.substring(0, start) + "\n1. " + text.substring(start);
        break;
      case "-":
        newText = text.substring(0, start) + "\n- " + text.substring(start);
        break;
      case ">":
        newText = text.substring(0, start) + "\n> " + text.substring(start);
        break;
      default:
        newText = text;
    }

    setContent(newText);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      console.log("Uploading status:", uploading);
      const fileId = ID.unique();
      // upload to Appwrite Storage
      await storage.createFile(questionAttachmentBucket, fileId, file);
      const url = storage.getFileView(questionAttachmentBucket, fileId);
      // insert markdown image link
      setContent((prev: string) => prev + `\n![${file.name}](${url})\n`);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createQuestion = async () => {
    try {
      let attachmentId;
      if (attachment) {
        const fileId = ID.unique();
        await storage.createFile(questionAttachmentBucket, fileId, attachment);
        attachmentId = fileId;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        authorId: user?.$id,
        tags,
        ...(attachmentId && { attachmentId }),
      };
      const authorId = user?.$id || "anonymous";
      console.log("Creating question with payload:", authorId);
      // Ensure your collection allows "create" for role:any in the Appwrite console
      const response = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title: payload.title,
          content: payload.content,
          authorId: payload.authorId,
          tags: Array.from(payload.tags),
          attachmentId: attachmentId,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(authorId)),
          Permission.delete(Role.user(authorId)),
        ]
      );
      console.log("Question created:", response);
      return response;
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        (e as { code: number }).code === 401
      )
        toast.error(
          "Unauthorized: check collection create permissions in Appwrite console"
        );
      throw e;
    }
  };

  const updateQuestion = async () => {
    if (!question) throw new Error("No question to update");

    try {
      let attachmentId = question.attachmentId;
      if (attachment) {
        if (attachmentId)
          await storage.deleteFile(questionAttachmentBucket, attachmentId);
        const fileId = ID.unique();
        await storage.createFile(questionAttachmentBucket, fileId, attachment);
        attachmentId = fileId;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        authorId: user?.$id,
        tags,
        attachmentId,
      };
      const authorId = user?.$id || "any";
      return databases.updateDocument(
        db,
        questionCollection,
        question.$id,
        payload,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(authorId)),
          Permission.delete(Role.user(authorId)),
        ]
      );
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        (e as { code: number }).code === 401
      )
        toast.error("Unauthorized: cannot update this question.");
      throw e;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || tags.length === 0) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = question ? await updateQuestion() : await createQuestion();
      toast.success(question ? "Updated" : "Published");
      router.push(`/questions/${res.$id}/${slugify(title)}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message || "Submission failed");
      } else {
        toast.error("Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-8 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-8 backdrop-blur-lg">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2 md:mb-4">
              {question ? "Edit Your Question" : "Ask a Question"}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {question
                ? "Update your question details below."
                : "Get help by asking a clear, well-formatted question."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            {/* Title */}
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-6 backdrop-blur-lg">
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question?"
                required
                maxLength={100}
                className="bg-white/5 border-emerald-500/20 text-white focus:border-emerald-500/40 text-sm md:text-base"
              />
            </div>

            {/* Content */}
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-6 backdrop-blur-lg">
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="w-full bg-white/5 border-emerald-500/20">
                  <TabsTrigger
                    value="write"
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-emerald-500/20"
                  >
                    <PenLine className="w-3 h-3 md:w-4 md:h-4" />
                    Write
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-emerald-500/20"
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="mt-3 md:mt-4">
                  <div className="rounded-lg overflow-hidden border border-emerald-500/20">
                    <EditorToolbar
                      onAction={handleEditorAction}
                      onImageUpload={handleImageUpload}
                    />
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe your question in detail"
                      required
                      className="min-h-[200px] md:min-h-[300px] bg-white/5 border-0 text-white focus:border-emerald-500/40 rounded-none text-sm md:text-base"
                      maxLength={10000}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-3 md:mt-4">
                  <div className="min-h-[200px] md:min-h-[300px] p-3 md:p-4 rounded-lg bg-white/5 border border-emerald-500/20 prose prose-invert prose-sm md:prose max-w-none">
                    {content ? (
                      <ReactMarkdown>{content}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        Nothing to preview yet...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Tags & Attachment */}
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-4 md:p-6 backdrop-blur-lg space-y-3 md:space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-300 mb-2 flex items-center gap-1 md:gap-2">
                  <Tags className="w-3 h-3 md:w-4 md:h-4" />
                  Tags
                </label>
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (press Enter)"
                  className="bg-white/5 border-emerald-500/20 text-white focus:border-emerald-500/40 text-sm md:text-base"
                />
                <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs md:text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-emerald-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-300 mb-2">
                  Image Attachment
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="bg-white/5 border-emerald-500/20 text-white focus:border-emerald-500/40 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 md:py-6 rounded-lg font-medium text-base md:text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              disabled={submitting}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              {question ? "Update Question" : "Post Your Question"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
