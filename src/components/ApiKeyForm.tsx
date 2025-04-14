
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  saveApiKey, 
  getApiKey, 
  removeApiKey, 
  saveModel, 
  getModel 
} from "@/utils/api-key-storage";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Check, 
  Key, 
  Trash2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OpenAIModel, ApiKeyFormProps } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApiKeyForm({ onModelChange }: ApiKeyFormProps = {}) {
  const [apiKey, setApiKey] = useState("");
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [model, setModel] = useState<OpenAIModel>(getModel() as OpenAIModel || 'gpt-4o');

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setHasSavedKey(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.warning("The API key doesn't follow the expected format. OpenAI API keys typically start with 'sk-'");
    }

    saveApiKey(apiKey);
    setHasSavedKey(true);
    toast.success("API key saved successfully");
  };

  const handleRemoveKey = () => {
    removeApiKey();
    setApiKey("");
    setHasSavedKey(false);
    setIsVisible(false);
    toast.info("API key removed");
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleModelChange = (value: string) => {
    const newModel = value as OpenAIModel;
    setModel(newModel);
    saveModel(newModel);
    if (onModelChange) {
      onModelChange(newModel);
    }
    toast.info(`Model changed to ${newModel}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          {hasSavedKey 
            ? "Your OpenAI API key is securely stored in your browser's local storage."
            : "Enter your OpenAI API key to use the company info extraction features."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apiKey">API Key</Label>
            {hasSavedKey && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleVisibility} 
                className="h-7 px-2 text-xs"
              >
                {isVisible ? "Hide" : "Show"}
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type={isVisible ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">OpenAI Model</Label>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o (Default, balanced)</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</SelectItem>
              <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most powerful)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select a different model if you're experiencing permission issues
          </p>
        </div>

        <Alert variant="destructive" className="bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>If you're seeing API key permission errors, please check:</p>
              <ul className="list-disc pl-5 text-xs space-y-1">
                <li>Your API key is valid and not expired</li>
                <li>Your OpenAI account has billing set up</li>
                <li>Your API key has the "model.request" scope enabled</li>
                <li>You have access to the selected model in your OpenAI account</li>
              </ul>
              <div className="pt-2">
                <a 
                  href="https://platform.openai.com/account/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  Verify your API key settings on OpenAI <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleRemoveKey}
          disabled={!hasSavedKey}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
        <Button onClick={handleSaveKey} className="gap-2">
          <Check className="h-4 w-4" />
          Save Key
        </Button>
      </CardFooter>
    </Card>
  );
}
