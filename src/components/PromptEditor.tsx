
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
  const [prevWebsite, setPrevWebsite] = useState(website);
  const [prevFields, setPrevFields] = useState<ExtractField[]>([]);
  
  // Generate the default prompt based on website and fields
  const generateDefaultPrompt = (targetWebsite: string, targetFields: ExtractField[]) => {
    const fieldsText = targetFields.map(field => field.name).join(", ");
    return `Extract the following information about the company at ${targetWebsite}:
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
    const fetchPrompt = async () => {
      const customPrompt = await getCustomPrompt();
      
      if (customPrompt) {
        setPromptText(customPrompt);
        setSavedPrompt(customPrompt);
      } else {
        const newDefaultPrompt = generateDefaultPrompt(website, fields);
        setPromptText(newDefaultPrompt);
      }
    };
    
    fetchPrompt();
    setPrevFields(fields);
  }, []);

  // When fields change, update the prompt if using default, or if website changes
  useEffect(() => {
    // Only regenerate if using default prompt (no saved prompt) or if website changed
    const fieldsChanged = JSON.stringify(fields) !== JSON.stringify(prevFields);
    const websiteChanged = website !== prevWebsite;
    
    if ((fieldsChanged || websiteChanged) && !savedPrompt) {
      const newDefaultPrompt = generateDefaultPrompt(website, fields);
      setPromptText(newDefaultPrompt);
      onPromptChange(newDefaultPrompt);
    }
    
    setPrevWebsite(website);
    setPrevFields(fields);
  }, [website, fields, savedPrompt]);

  const handleSavePrompt = async () => {
    if (promptText.trim() === "") {
      toast.error("Prompt cannot be empty");
      return;
    }

    await saveCustomPrompt(promptText);
    setSavedPrompt(promptText);
    setIsEditing(false);
    onPromptChange(promptText);
    toast.success("Custom prompt saved");
  };

  const handleResetPrompt = async () => {
    const defaultPromptText = generateDefaultPrompt(website, fields);
    setPromptText(defaultPromptText);
    await saveCustomPrompt(null);
    setSavedPrompt(null);
    onPromptChange(defaultPromptText);
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
              {savedPrompt || generateDefaultPrompt(website, fields)}
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
