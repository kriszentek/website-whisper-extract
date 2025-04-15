
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyData, ExtractedInfo } from "@/types";
import { Info, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResultsCardProps {
  data: CompanyData[] | null;
  isLoading: boolean;
}

export default function ResultsCard({ data, isLoading }: ResultsCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Results
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Results
          </CardTitle>
          <CardDescription>
            Enter websites above to analyze company information
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No data to display yet
        </CardContent>
      </Card>
    );
  }

  // Get field names from the first result
  const fieldNames = data[0].info.map(item => item.name);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Analysis Results
        </CardTitle>
        <CardDescription>
          Analysis results for {data.length} website{data.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                {fieldNames.map((name) => (
                  <TableHead key={name}>{name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((company, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center hover:underline gap-1"
                    >
                      {new URL(company.website).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  {company.info.map((item, i) => (
                    <TableCell key={i}>{item.value || "Unknown"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
