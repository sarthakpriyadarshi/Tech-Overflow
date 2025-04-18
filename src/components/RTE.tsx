import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import EditorToolbar from "@/components/editor/EditorToolbar";

interface RTEProps {
  value: string;
  onChange: (value: string) => void;
}

const RTE: React.FC<RTEProps> = ({ value, onChange }) => {
  const handleEditorAction = (action: string) => {
    const textarea = document.querySelector("textarea");
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

    onChange(newText);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a local URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      // Insert markdown image link
      onChange(value + `\n![${file.name}](${imageUrl})\n`);
    } catch (err) {
      console.error("Error handling image:", err);
    }
  };

  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="w-full bg-white/5 border-emerald-500/20">
        <TabsTrigger
          value="write"
          className="flex items-center gap-2 data-[state=active]:bg-emerald-500/20"
        >
          <PenLine className="w-4 h-4" />
          Write
        </TabsTrigger>
        <TabsTrigger
          value="preview"
          className="flex items-center gap-2 data-[state=active]:bg-emerald-500/20"
        >
          <Eye className="w-4 h-4" />
          Preview
        </TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-4">
        <div className="rounded-lg overflow-hidden border border-emerald-500/20">
          <EditorToolbar
            onAction={handleEditorAction}
            onImageUpload={handleImageUpload}
          />
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your content..."
            className="min-h-[300px] bg-white/5 border-0 text-white focus:border-emerald-500/40 rounded-none"
          />
        </div>
      </TabsContent>
      <TabsContent value="preview" className="mt-4">
        <div className="min-h-[300px] p-4 rounded-lg bg-white/5 border border-emerald-500/20 prose prose-invert max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Nothing to preview yet...</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RTE;

// Export MarkdownPreview component for use in other parts of the application
export const MarkdownPreview: React.FC<{
  source: string;
  className?: string;
}> = ({ source, className }) => (
  <div className={className}>
    <ReactMarkdown>{source}</ReactMarkdown>
  </div>
);
