import { useState, useEffect } from "react";
import WebsiteForm from "@/components/WebsiteForm";
import ResultsCard from "@/components/ResultsCard";
import ApiKeyForm from "@/components/ApiKeyForm";
import CustomFieldsManager from "@/components/CustomFieldsManager";
import PromptEditor from "@/components/PromptEditor";
import { CompanyData, ExtractField, OpenAIModel } from "@/types";
import { extractCompanyInfo } from "@/services/openai-service";
import { getExtractFields, addExtractField, removeExtractField } from "@/utils/extract-fields-storage";
import { DEFAULT_EXTRACT_FIELDS } from "@/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Search, PlusCircle } from "lucide-react";
import { getCustomPrompt } from "@/utils/api-key-storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const [companiesData, setCompaniesData] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  const [extractFields, setExtractFields] = useState<ExtractField[]>(DEFAULT_EXTRACT_FIELDS);
  const [website, setWebsite] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);

  const loadFields = async () => {
    try {
      const fields = await getExtractFields();
      console.log('Loaded fields:', fields);
      setExtractFields(fields);
      setFieldsLoaded(true);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error("Failed to load extraction fields");
      setExtractFields(DEFAULT_EXTRACT_FIELDS);
      setFieldsLoaded(true);
    }
  };

  useEffect(() => {
    loadFields();
    
    const fetchPrompt = async () => {
      const prompt = await getCustomPrompt();
      setCustomPrompt(prompt);
    };
    
    fetchPrompt();
  }, []);

  useEffect(() => {
    if (fieldsLoaded && website) {
      setShowPromptEditor(true);
    }
  }, [fieldsLoaded, website]);

  const handleAddField = async (field: ExtractField) => {
    try {
      await addExtractField(field);
      toast.success(`Added field: ${field.name}`);
      await loadFields();
    } catch (error) {
      console.error('Error adding field:', error);
      toast.error(`Failed to add field: ${field.name}`);
    }
  };

  const handleRemoveField = async (id: string) => {
    try {
      await removeExtractField(id);
      toast.success("Field removed successfully");
      await loadFields();
    } catch (error) {
      console.error('Error removing field:', error);
      toast.error("Failed to remove field");
    }
  };

  const handleWebsitesSubmit = async (websites: string[]) => {
    setIsLoading(true);
    setWebsite(websites[0]);
    setApiError(null);
    
    try {
      const results = await Promise.all(
        websites.map(website => 
          extractCompanyInfo(website, extractFields, customPrompt)
        )
      );
      
      const successfulResults = results
        .filter(response => response.success)
        .map(response => response.data);
      
      const errors = results
        .filter(response => !response.success)
        .map(response => response.error);
      
      if (errors.length > 0) {
        const errorMessage = `Some analyses failed: ${errors.join('; ')}`;
        setApiError(errorMessage);
        toast.error(errorMessage);
      }

      if (successfulResults.length > 0) {
        setCompaniesData(successfulResults);
      }
    } catch (error) {
      console.error("Error extracting company info:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setApiError(`An unexpected error occurred: ${errorMessage}`);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (prompt: string | null) => {
    setCustomPrompt(prompt);
  };

  const handleModelChange = (model: OpenAIModel) => {
    setCompaniesData([]);
    setApiError(null);
  };

  const togglePromptEditor = () => {
    setShowPromptEditor(!showPromptEditor);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "customize") {
      loadFields();
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Website Whisper</h1>
        <p className="text-muted-foreground mt-2">Extract company information from websites using AI</p>
        <Badge variant="outline" className="mt-2 bg-green-50">Server-powered AI - No API key required</Badge>
      </header>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Customize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6 mt-6">
          <WebsiteForm 
            onSubmit={handleWebsitesSubmit} 
            isLoading={isLoading}
          />
          
          {apiError && (
            <Alert variant="destructive" className="bg-destructive/10">
              <AlertDescription className="whitespace-pre-wrap">
                <div className="font-semibold">API Error Details:</div>
                <div className="text-sm mt-1">{apiError}</div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="pt-2">
            <ResultsCard data={companiesData} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="customize" className="mt-6 space-y-6">
          <PromptEditor
            onPromptChange={handlePromptChange}
            defaultPrompt=""
            website={website}
            fields={extractFields}
          />
          <CustomFieldsManager 
            fields={extractFields} 
            defaultFields={DEFAULT_EXTRACT_FIELDS}
            onAddField={handleAddField} 
            onRemoveField={handleRemoveField}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
