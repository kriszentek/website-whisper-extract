
# Services Documentation

## OpenAI Service (`src/services/openai-service.ts`)

The `openai-service.ts` file contains the logic for interacting with the Supabase edge function to extract company information from websites.

### Main Function: `extractCompanyInfo`

```typescript
async function extractCompanyInfo(
  website: string, 
  fields: ExtractField[],
  customPrompt?: string | null
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

1. **Supabase Edge Function Integration**:
   - Calls a secure Supabase edge function that handles the OpenAI API interaction
   - Passes the website URL, fields, and any custom prompt to the function

2. **Error Handling**:
   - Handles API errors with detailed error messages
   - Provides appropriate feedback to the user interface

3. **Response Processing**:
   - Parses the JSON response from the edge function
   - Maps the response to the internal data structure

4. **Security**:
   - Does not require an API key from the user
   - All sensitive API communication happens server-side

### Edge Function: `extract-info`

The Edge Function performs the actual communication with OpenAI:

1. Retrieves the OpenAI API key from environment variables
2. Constructs an appropriate prompt based on the website URL and fields to extract
3. Makes a request to the OpenAI API
4. Processes the response
5. Returns the structured data to the client

#### Error Handling in the Edge Function:

The Edge Function handles various error scenarios:

- Missing API key
- Invalid API key
- OpenAI API errors
- Malformed responses
- Timeout issues

Each error is logged and returned with a clear message to help troubleshooting.
