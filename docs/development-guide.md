
# Development Guide

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Project Structure

```
website-whisper/
├── src/
│   ├── components/       # UI components
│   ├── hooks/            # React hooks
│   ├── integrations/     # Third-party integrations (Supabase)
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── supabase/
│   ├── functions/        # Supabase Edge Functions
│   └── config.toml       # Supabase configuration
└── docs/                 # Documentation
```

## Adding a New Feature

To add a new feature to the application:

1. **Create any necessary components** in the `components` directory
2. **Add any new services** in the `services` directory
3. **Update types** in the `types` directory
4. **Integrate with the main application** in relevant pages or components

### Example: Adding a New Extraction Field Type

1. Update the `ExtractField` interface in `types/index.ts`
2. Add UI for the new field type in `CustomFieldsManager.tsx`
3. Update the prompt generation in `PromptEditor.tsx`
4. Handle the new field type in the results display in `ResultsCard.tsx`

## Working with the OpenAI Integration

### Server-side API Key

The application uses a server-side approach to OpenAI integration:

1. The OpenAI API key is stored securely in the Supabase database
2. Requests to OpenAI are made through a Supabase Edge Function
3. The Edge Function retrieves the API key using a secure database function

To update the OpenAI API key:

1. Connect to the Supabase project
2. Use SQL to update the app_settings table:
   ```sql
   -- If the key doesn't exist yet:
   INSERT INTO app_settings (id, value, description)
   VALUES ('openai_api_key', 'sk-your-api-key', 'OpenAI API key for Website Whisper');

   -- If the key already exists:
   UPDATE app_settings 
   SET value = 'sk-your-new-api-key'
   WHERE id = 'openai_api_key';
   ```

### Adding Support for a New Model

1. Update the `OpenAIModel` type in `types/index.ts`
2. Add the new model option to the Edge Function

## Error Handling

The application uses a combination of:
- Toast messages for user feedback
- Detailed error display for API issues
- Console logging for development debugging

When extending error handling, follow the pattern of:
1. Catching errors in the service layer
2. Returning structured error responses
3. Displaying user-friendly messages in the UI

## Local Storage

The application uses browser local storage for:
- Selected model preferences
- Custom extraction fields
- Custom prompt

When adding new features that require persistence, follow the pattern in the existing utility files.

## Supabase Edge Functions

The application uses Supabase Edge Functions to handle server-side processing. To modify or extend these functions:

1. Edit the files in the `supabase/functions/` directory
2. Update the `supabase/config.toml` file if needed
3. Deploy the changes following the Supabase deployment guidelines

When making changes to Edge Functions, be sure to test them thoroughly before deployment.
