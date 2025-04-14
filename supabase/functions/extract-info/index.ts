
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with the URL and anon key from the request
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Retrieve the OpenAI API key from the database using the secured function
    const { data, error } = await supabase.rpc('get_app_setting', { 
      setting_id: 'openai_api_key' 
    });

    if (error || !data) {
      console.error('Error retrieving API key:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'API key not found or error retrieving it' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = data;
    
    // Parse the request body to get parameters
    const { website, fields, customPrompt } = await req.json();

    if (!website || !fields) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required parameters: website or fields"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a prompt that asks for specific information
    const fieldsText = fields.map((field: { name: string }) => field.name).join(", ");
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

    // Use gpt-4o as specified by the user
    const model = 'gpt-4o';

    console.log("Using model:", model);
    console.log("Sending prompt to OpenAI");

    // Make the request to OpenAI
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
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      
      // Get detailed error message
      let errorMessage = errorData.error?.message || response.statusText;
      
      // Provide more user-friendly message for common errors
      if (errorMessage.includes("insufficient permissions") || errorMessage.includes("Missing scopes")) {
        errorMessage = "The API key doesn't have sufficient permissions. Please check that it's valid and has access to the required models.";
      } else if (errorMessage.includes("invalid_api_key") || errorMessage.includes("Invalid API key")) {
        errorMessage = "The OpenAI API key appears to be invalid. Please check that it's correct.";
      } else if (errorMessage.includes("Rate limit")) {
        errorMessage = "Rate limit reached for OpenAI API requests. Please try again later.";
      } else if (errorMessage.includes("does not have access to model")) {
        errorMessage = `Your OpenAI API key doesn't have access to the ${model} model. Please check your OpenAI account permissions and subscription.`;
      }
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data_response = await response.json();
    console.log("OpenAI API Response received");
    
    // Parse the completion to extract the JSON
    try {
      // Extract JSON from the completion
      const content = data_response.choices[0].message.content;
      
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

        const companyData = {
          website,
          info: extractedInfo,
          timestamp: Date.now()
        };

        return new Response(JSON.stringify({ 
          success: true, 
          data: companyData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Invalid response format from API" 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Request Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Request failed: ${error instanceof Error ? error.message : String(error)}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
