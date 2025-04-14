
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
import { Settings, Search, PlusCircle, Edit, Info } from "lucide-react";
import { getCustomPrompt } from "@/utils/api-key-storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  const [extractFields, setExtractFields] = useState<ExtractField[]>(DEFAULT_EXTRACT_FIELDS);
  const [website, setWebsite] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Load extract fields from storage
    setExtractFields(getExtractFields());
    
    // Load custom prompt
    const fetchPrompt = async () => {
      const prompt = await getCustomPrompt();
      setCustomPrompt(prompt);
    };
    
    fetchPrompt();
  }, []);

  const handleAddField = (field: ExtractField) => {
    addExtractField(field);
    setExtractFields(getExtractFields());
  };

  const handleRemoveField = (id: string) => {
    removeExtractField(id);
    setExtractFields(getExtractFields());
  };

  const handleWebsiteSubmit = async (website: string) => {
    setIsLoading(true);
    setWebsite(website);
    setApiError(null);
    
    try {
      const response = await extractCompanyInfo(website, extractFields, customPrompt);
      
      if (response.success) {
        setCompanyData(response.data);
      } else {
        setApiError(response.error || "Failed to extract information");
        toast.error(response.error || "Failed to extract information");
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
    // When model changes, we can clear previous data to avoid confusion
    setCompanyData(null);
    setApiError(null);
  };

  const togglePromptEditor = () => {
    setShowPromptEditor(!showPromptEditor);
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
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyze" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6 mt-6">
          <WebsiteForm 
            onSubmit={handleWebsiteSubmit} 
            isLoading={isLoading}
            showPrompt={() => setShowPromptEditor(true)}
          />
          
          {(showPromptEditor || !!customPrompt) && (
            <PromptEditor
              onPromptChange={handlePromptChange}
              defaultPrompt=""
              website={website}
              fields={extractFields}
            />
          )}
          
          {apiError && (
            <Alert variant="destructive" className="bg-destructive/10">
              <Info className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-wrap">
                <div className="font-semibold">API Error Details:</div>
                <div className="text-sm mt-1">{apiError}</div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="pt-2">
            <ResultsCard data={companyData} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="customize" className="mt-6">
          <CustomFieldsManager 
            fields={extractFields} 
            defaultFields={DEFAULT_EXTRACT_FIELDS}
            onAddField={handleAddField} 
            onRemoveField={handleRemoveField}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">About Website Whisper</h3>
              <p className="text-muted-foreground mt-2">
                This application uses AI to extract company information from websites. 
                All processing is handled securely on our servers - no API keys required!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4" /> 
                Server-Powered AI
              </h4>
              <p className="text-sm mt-2">
                Website Whisper is powered by a secure server-side implementation that handles API communication
                with OpenAI. You can analyze websites without needing your own API key.
              </p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription>
                <p className="font-medium">Open Source Project</p>
                <p className="text-sm mt-1">
                  This is an open-source project. You can find the source code and documentation
                  on GitHub.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
