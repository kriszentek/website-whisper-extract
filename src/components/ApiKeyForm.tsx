
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveApiKey, getApiKey, removeApiKey } from "@/utils/api-key-storage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Key, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState("");
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
      <CardContent>
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
