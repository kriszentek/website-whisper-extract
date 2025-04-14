
import { getCustomPrompt } from "@/utils/api-key-storage";
import { ExtractField, ApiResponse, CompanyData } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export async function extractCompanyInfo(
  website: string, 
  fields: ExtractField[],
  customPrompt?: string
): Promise<ApiResponse> {
  try {
    const customPromptValue = customPrompt || getCustomPrompt();
    
    // Call our Supabase Edge Function instead of directly calling OpenAI
    const { data, error } = await supabase.functions.invoke('extract-info', {
      body: {
        website,
        fields,
        customPrompt: customPromptValue
      }
    });

    if (error) {
      console.error("Edge Function Error:", error);
      return { 
        success: false, 
        error: `Error calling extraction service: ${error.message}` 
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Unknown error occurred"
      };
    }

    return {
      success: true,
      data: data.data as CompanyData
    };
  } catch (error) {
    console.error("Request Error:", error);
    return { 
      success: false, 
      error: `Request failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}
