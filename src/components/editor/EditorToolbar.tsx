import React from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, Image, ListOrdered, Quote } from "lucide-react";

interface EditorToolbarProps {
  onAction: (action: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onAction,
  onImageUpload,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-t-lg border-b border-emerald-500/20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction("**")}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction("*")}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction("[")}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      >
        <Link className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction("1.")}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction(">")}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      >
        <Quote className="w-4 h-4" />
      </Button>
      <div className="relative">
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById("image-upload")?.click()}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
