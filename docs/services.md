
# Services Documentation

## OpenAI Service (`src/services/openai-service.ts`)

The `openai-service.ts` file contains the logic for interacting with the Supabase edge function to extract company information from websites.

### Main Function: `extractCompanyInfo`

```typescript
async function extractCompanyInfo(
  website: string, 
  fields: ExtractField[],
  customPrompt?: string
): Promise<ApiResponse>
```

#### Parameters:
- `website`: The URL of the company website to analyze
- `fields`: Array of fields to extract (name and ID)
- `customPrompt`: Optional custom prompt to override the default

#### Returns:
- `ApiResponse`: Object containing either:
  - `success: true` and `data: CompanyData` with the extracted information
  - `success: false` and `error: string` with error details

#### Implementation Details:

1. **Edge Function Integration**:
   - Calls a secure Supabase edge function that handles the OpenAI API interaction
   - Passes the website URL, fields, and any custom prompt to the function

2. **Error Handling**:
   - Handles API errors with detailed error messages
   - Provides appropriate feedback to the user interface

3. **Response Processing**:
   - Parses the JSON response from the edge function
   - Maps the response to the internal data structure

4. **Data Formatting**:
   - Structures the extracted data with timestamps
   - Returns in a consistent format for the UI to render
