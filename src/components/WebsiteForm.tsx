
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search } from "lucide-react";
import { hasApiKey } from "@/utils/api-key-storage";
import { toast } from "sonner";

interface WebsiteFormProps {
  onSubmit: (website: string) => void;
  isLoading: boolean;
  showPrompt: () => void;
}

export default function WebsiteForm({ onSubmit, isLoading, showPrompt }: WebsiteFormProps) {
  const [website, setWebsite] = useState("");

  const validateUrl = (url: string): boolean => {
    // Simple URL validation
    try {
      // Add protocol if missing
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasApiKey()) {
      toast.error("Please add your OpenAI API key in settings first");
      return;
    }

    const trimmedWebsite = website.trim();
    if (!trimmedWebsite) {
      toast.error("Please enter a website");
      return;
    }

    if (!validateUrl(trimmedWebsite)) {
      toast.error("Please enter a valid website URL");
      return;
    }

    // Normalize URL (add https:// if needed)
    const normalizedUrl = trimmedWebsite.startsWith('http') 
      ? trimmedWebsite 
      : `https://${trimmedWebsite}`;

    onSubmit(normalizedUrl);
    showPrompt(); // Show the prompt editor after submitting
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Website Analysis
        </CardTitle>
        <CardDescription>
          Enter a company website to extract information using OpenAI
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter company website (e.g., example.com)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="gap-2"
          >
            {isLoading ? "Analyzing..." : (
              <>
                <Search className="h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
