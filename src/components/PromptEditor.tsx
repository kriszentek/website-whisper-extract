
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Undo } from "lucide-react";
import { ExtractField, PromptEditorProps } from "@/types";
import { toast } from "sonner";
import { saveCustomPrompt, getCustomPrompt } from "@/utils/api-key-storage";

export default function PromptEditor({ onPromptChange, defaultPrompt, website, fields }: PromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null);
  
  // Generate the default prompt based on website and fields
  const generateDefaultPrompt = () => {
    const fieldsText = fields.map(field => field.name).join(", ");
    return `Extract the following information about the company at ${website}:
${fieldsText}

Format your response as a JSON object with the following structure:
{
  "results": [
    { "field": "Field Name 1", "value": "extracted value or null if unknown" },
    { "field": "Field Name 2", "value": "extracted value or null if unknown" }
  ]
}`;
  };

  useEffect(() => {
    // Load saved prompt or generate default
    const customPrompt = getCustomPrompt();
    
    if (customPrompt) {
      setPromptText(customPrompt);
      setSavedPrompt(customPrompt);
    } else {
      const newDefaultPrompt = generateDefaultPrompt();
      setPromptText(newDefaultPrompt);
    }
  }, [website, fields]);

  const handleSavePrompt = () => {
    if (promptText.trim() === "") {
      toast.error("Prompt cannot be empty");
      return;
    }

    saveCustomPrompt(promptText);
    setSavedPrompt(promptText);
    setIsEditing(false);
    onPromptChange(promptText);
    toast.success("Custom prompt saved");
  };

  const handleResetPrompt = () => {
    const defaultPromptText = generateDefaultPrompt();
    setPromptText(defaultPromptText);
    saveCustomPrompt(null);
    setSavedPrompt(null);
    onPromptChange(null);
    setIsEditing(false);
    toast.info("Prompt reset to default");
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          AI Prompt
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Edit the prompt to customize how information is extracted"
            : "The prompt that will be sent to OpenAI to extract information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Enter your custom prompt here..."
          />
        ) : (
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
            <pre className="whitespace-pre-wrap text-sm">
              {savedPrompt || generateDefaultPrompt()}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleResetPrompt}
              className="gap-2"
            >
              <Undo className="h-4 w-4" />
              Reset to Default
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePrompt}>Save Changes</Button>
            </div>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleResetPrompt}
              disabled={!savedPrompt}
              className="gap-2"
            >
              <Undo className="h-4 w-4" />
              Reset to Default
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              Edit Prompt
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
