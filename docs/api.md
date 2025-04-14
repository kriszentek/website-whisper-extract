
# API Documentation

## OpenAI API

The application uses the OpenAI Chat Completions API to extract company information from websites.

### Chat Completions Endpoint

```
POST https://api.openai.com/v1/chat/completions
```

#### Headers:
- `Content-Type`: `application/json`
- `Authorization`: `Bearer YOUR_API_KEY`

#### Request Body:

```json
{
  "model": "gpt-4o",
  "messages": [
    { 
      "role": "system", 
      "content": "You are a helpful assistant that extracts company information from websites. Always return data in the exact JSON format requested."
    },
    { 
      "role": "user", 
      "content": "Extract the following information about the company at example.com: company name, industry, etc..."
    }
  ],
  "temperature": 0.5,
  "max_tokens": 1000,
  "response_format": { "type": "json_object" }
}
```

#### Response Format:

The API is expected to return a JSON response with the following structure:

```json
{
  "results": [
    { "field": "Company Name", "value": "Example Corp" },
    { "field": "Industry", "value": "Technology" },
    { "field": "Founded", "value": "2005" }
  ]
}
```

### Error Handling

The application handles several types of API errors:

1. **Authentication Errors (401)**: 
   - Likely due to invalid API key or insufficient permissions
   - Check that the API key is valid and has the "model.request" scope

2. **Model Availability Errors**: 
   - Model may not be available or the account may not have access
   - Try using a different model or check account permissions

3. **Rate Limit Errors (429)**:
   - Account has exceeded its quota
   - Wait or upgrade the OpenAI plan

4. **Server Errors (5xx)**:
   - Issues with the OpenAI service
   - Retry the request later

## Supabase Edge Function

The application uses a Supabase Edge Function to securely communicate with the OpenAI API.

### Edge Function: `extract-info`

#### Endpoint:
```
POST https://<your-project-ref>.supabase.co/functions/v1/extract-info
```

#### Request Body:
```json
{
  "website": "https://example.com",
  "fields": [
    { "id": "company_name", "name": "Company Name" },
    { "id": "industry", "name": "Industry" }
  ],
  "customPrompt": "Optional custom prompt to override the default"
}
```

#### Response:
```json
{
  "success": true,
  "data": {
    "website": "https://example.com",
    "info": [
      { "name": "Company Name", "value": "Example Corp" },
      { "name": "Industry", "value": "Technology" }
    ],
    "timestamp": 1631234567890
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

### Security

The Edge Function:
1. Retrieves the OpenAI API key from secure environment variables
2. Does not require authentication from the client
3. Validates input parameters
4. Handles errors gracefully

This approach ensures that:
- The OpenAI API key is never exposed to the client
- API requests are properly authenticated
- The application can be used without requiring users to obtain their own API keys
