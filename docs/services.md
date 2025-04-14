
# Services Documentation

## OpenAI Service (`src/services/openai-service.ts`)

The `openai-service.ts` file contains the logic for interacting with the OpenAI API to extract company information from websites.

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

1. **API Key Validation**:
   - Retrieves the API key from local storage
   - Returns an error if no API key is found

2. **Prompt Generation**:
   - Uses the provided fields to build a structured prompt
   - Uses custom prompt if provided, otherwise generates a default

3. **OpenAI API Request**:
   - Sends a chat completion request to OpenAI
   - Uses the selected model from local storage
   - Configures the request to return JSON formatted data

4. **Error Handling**:
   - Handles API errors with detailed error messages
   - Special handling for permission errors and model availability issues

5. **Response Processing**:
   - Parses the JSON response from OpenAI
   - Maps the response to the internal data structure

6. **Data Formatting**:
   - Structures the extracted data with timestamps
   - Returns in a consistent format for the UI to render
