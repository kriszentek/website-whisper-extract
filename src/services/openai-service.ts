
import { getApiKey, getModel } from "@/utils/api-key-storage";
import { ExtractField, ApiResponse, CompanyData } from "@/types";

export async function extractCompanyInfo(
  website: string, 
  fields: ExtractField[],
  customPrompt?: string
): Promise<ApiResponse> {
  const apiKey = getApiKey();
  const model = getModel();
  
  if (!apiKey) {
    return { 
      success: false, 
      error: "Missing API key. Please add your OpenAI API key in settings." 
    };
  }

  try {
    // Create a prompt that asks for specific information
    const fieldsText = fields.map(field => field.name).join(", ");
    const prompt = customPrompt || 
    `Extract the following information about the company at ${website}:
${fieldsText}

Format your response as a JSON object with the following structure:
{
  "results": [
    { "field": "Field Name 1", "value": "extracted value or null if unknown" },
    { "field": "Field Name 2", "value": "extracted value or null if unknown" }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant that extracts company information from websites. Always return data in the exact JSON format requested." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" } // Use the newer response format API
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || response.statusText;
      
      // Handle specific API key permission error
      if (errorMessage.includes("insufficient permissions") || errorMessage.includes("Missing scopes")) {
        return { 
          success: false, 
          error: `API Key Error: Your API key doesn't have the proper permissions. Error: ${errorMessage}` 
        };
      }
      
      return { 
        success: false, 
        error: `API Error: ${errorMessage}` 
      };
    }

    const data = await response.json();
    
    // Parse the completion to extract the JSON
    try {
      // Extract JSON from the completion
      const content = data.choices[0].message.content;
      
      // With response_format: { type: "json_object" }, content should already be valid JSON
      let parsedResults;
      try {
        parsedResults = JSON.parse(content);
      } catch (e) {
        // If parsing fails, content might already be a JSON object
        parsedResults = content;
      }

      // Map the API response to our internal format
      if (parsedResults && parsedResults.results) {
        const extractedInfo = parsedResults.results.map((item: any) => ({
          name: item.field,
          value: item.value
        }));

        const companyData: CompanyData = {
          website,
          info: extractedInfo,
          timestamp: Date.now()
        };

        return { success: true, data: companyData };
      } else {
        return { 
          success: false, 
          error: "Invalid response format from API" 
        };
      }
    } catch (parseError) {
      return { 
        success: false, 
        error: `Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Request failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}
