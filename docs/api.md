
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

## Supabase Integration

The application is set up to use Supabase as a backend service. The Supabase client is configured in `src/integrations/supabase/client.ts`.

### Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://crozbkbvsrqnegoncmhp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_PUBLISHABLE_KEY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

The application is currently set up for Supabase integration but does not actively use Supabase features. This integration provides an opportunity for future enhancements such as:

- User authentication
- Storing extracted company data
- Sharing extraction results
- Creating team collaboration features
