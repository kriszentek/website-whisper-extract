
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyData, ExtractedInfo } from "@/types";
import { Info, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultsCardProps {
  data: CompanyData | null;
  isLoading: boolean;
}

export default function ResultsCard({ data, isLoading }: ResultsCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            <div className="w-40">
              {/* Fix DOM nesting warning by not nesting div inside p */}
              <Skeleton className="h-4 w-full" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Enter a website above to analyze company information
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No data to display yet
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Based on analysis of {data.website}</span>
          <a 
            href={data.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-xs text-primary hover:underline gap-1"
          >
            Visit website
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.info.map((item: ExtractedInfo, index: number) => (
            <div key={index} className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">{item.name}</h3>
              <p className="text-lg">{item.value || "Unknown"}</p>
            </div>
          ))}
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Results generated on {formatDate(data.timestamp)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
