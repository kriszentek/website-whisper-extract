
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search } from "lucide-react";
import { toast } from "sonner";

interface WebsiteFormProps {
  onSubmit: (websites: string[]) => void;
  isLoading: boolean;
}

export default function WebsiteForm({ onSubmit, isLoading }: WebsiteFormProps) {
  const [websites, setWebsites] = useState("");

  const validateUrl = (url: string): boolean => {
    try {
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const websiteList = websites
      .split('\n')
      .map(site => site.trim())
      .filter(site => site.length > 0);

    if (websiteList.length === 0) {
      toast.error("Please enter at least one website");
      return;
    }

    const invalidUrls = websiteList.filter(site => !validateUrl(site));
    if (invalidUrls.length > 0) {
      toast.error(`Invalid URLs detected: ${invalidUrls.join(', ')}`);
      return;
    }

    // Normalize URLs (add https:// if needed)
    const normalizedUrls = websiteList.map(site => 
      site.startsWith('http') ? site : `https://${site}`
    );

    onSubmit(normalizedUrls);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Bulk Website Analysis
        </CardTitle>
        <CardDescription>
          Enter company websites (one per line) to extract information using OpenAI
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="Enter company websites (e.g., example.com)"
            value={websites}
            onChange={(e) => setWebsites(e.target.value)}
            className="min-h-[120px]"
          />
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
