
import { useState, useEffect } from "react";
import WebsiteForm from "@/components/WebsiteForm";
import ResultsCard from "@/components/ResultsCard";
import ApiKeyForm from "@/components/ApiKeyForm";
import CustomFieldsManager from "@/components/CustomFieldsManager";
import { CompanyData, ExtractField, OpenAIModel } from "@/types";
import { extractCompanyInfo } from "@/services/openai-service";
import { getExtractFields, addExtractField, removeExtractField } from "@/utils/extract-fields-storage";
import { DEFAULT_EXTRACT_FIELDS } from "@/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Search, PlusCircle } from "lucide-react";

export default function Index() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  const [extractFields, setExtractFields] = useState<ExtractField[]>(DEFAULT_EXTRACT_FIELDS);

  useEffect(() => {
    // Load extract fields from storage
    setExtractFields(getExtractFields());
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
    
    try {
      const response = await extractCompanyInfo(website, extractFields);
      
      if (response.success) {
        setCompanyData(response.data);
      } else {
        toast.error(response.error || "Failed to extract information");
      }
    } catch (error) {
      console.error("Error extracting company info:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: OpenAIModel) => {
    // When model changes, we can clear previous data to avoid confusion
    setCompanyData(null);
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Website Whisper</h1>
        <p className="text-muted-foreground mt-2">Extract company information from websites using AI</p>
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
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6 mt-6">
          <WebsiteForm onSubmit={handleWebsiteSubmit} isLoading={isLoading} />
          <ResultsCard data={companyData} isLoading={isLoading} />
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
          <ApiKeyForm onModelChange={handleModelChange} />
          <div className="mt-6">
            <h3 className="text-lg font-medium">About Website Whisper</h3>
            <p className="text-muted-foreground mt-2">
              This application uses OpenAI to extract company information from websites. 
              Your API key is stored securely in your browser's local storage and is only used 
              to make requests to the OpenAI API.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
