
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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OpenAIModel, ApiKeyFormProps } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApiKeyForm({ onModelChange }: ApiKeyFormProps = {}) {
  const [hasSavedKey, setHasSavedKey] = useState(true);
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');

  useEffect(() => {
    async function fetchModel() {
      const storedModel = await getModel();
      setModel(storedModel as OpenAIModel);
    }
    fetchModel();
  }, []);

  const handleModelChange = async (value: string) => {
    const newModel = value as OpenAIModel;
    await saveModel(newModel);
    setModel(newModel);
    
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
          API keys are securely managed on the server. Select your preferred OpenAI model.
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
              value="••••••••••••••••••••••••••"
              disabled={true}
              className="flex-1 bg-muted"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The API key is securely managed on the server
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
              <p className="text-sm">This application uses a server-side API key for secure OpenAI integration.</p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => handleModelChange(model)} className="gap-2">
          <Check className="h-4 w-4" />
          Apply Model
        </Button>
      </CardFooter>
    </Card>
  );
}
