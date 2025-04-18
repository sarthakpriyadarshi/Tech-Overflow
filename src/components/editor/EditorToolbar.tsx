import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Link,
  Image,
  ListOrdered,
  List,
  Quote,
} from "lucide-react";

interface EditorToolbarProps {
  onAction: (action: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onAction,
  onImageUpload,
}) => {
  // Create handlers that prevent the default action and call the passed in function
  const handleButtonClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onAction(action);
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-t-lg border-b border-emerald-500/20">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick("**", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick("*", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick("[", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <Link className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick("1.", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick("-", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleButtonClick(">", e)}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        type="button" // Explicitly set type to button
      >
        <Quote className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
