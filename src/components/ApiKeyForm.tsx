
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
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
  const [hasSavedKey, setHasSavedKey] = useState(true); // Always true with server-side key
  const [isVisible, setIsVisible] = useState(false);
  const [model, setModel] = useState<OpenAIModel>(getModel() as OpenAIModel || 'gpt-4o');

  // No need to check for API key as it's now handled on the server
  useEffect(() => {
    // Set as true since we're using server-side API key
    setHasSavedKey(true);
    // Mask the display with a placeholder
    setApiKey("••••••••••••••••••••••••••");
  }, []);

  const handleSaveKey = () => {
    // Not storing the key locally anymore, just inform user
    toast.info("API keys are now managed on the server");
  };

  const handleRemoveKey = () => {
    // Just for UI consistency
    toast.info("API keys are managed on the server and cannot be removed from the client");
  };

  const toggleVisibility = () => {
    // Since we don't actually have the key, just show a message
    toast.info("The actual API key is securely stored on the server");
    setIsVisible(false);
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
          OpenAI API Settings
        </CardTitle>
        <CardDescription>
          API keys are now securely managed on the server. You can still select which OpenAI model to use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apiKey">API Key</Label>
          </div>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type="password"
              placeholder="Managed by server"
              value={apiKey}
              disabled={true}
              className="flex-1 bg-muted"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The API key is now securely managed on the server
          </p>
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
            Select a different model if you're experiencing issues with the default model
          </p>
        </div>

        <Alert className="bg-blue-50/50 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Server-Powered AI</p>
              <p className="text-sm">This application now uses a server-side API key. You no longer need to provide your own OpenAI API key.</p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleModelChange.bind(null, model)} className="gap-2">
          <Check className="h-4 w-4" />
          Apply Model
        </Button>
      </CardFooter>
    </Card>
  );
}
