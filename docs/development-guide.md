
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

### API Key Requirements

To use the OpenAI integration, users need an API key with:
- "model.request" scope enabled
- Billing set up on their OpenAI account
- Access to the requested model

### Adding Support for a New Model

1. Update the `OpenAIModel` type in `types/index.ts`
2. Add the new model option to the selector in `ApiKeyForm.tsx`

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
- OpenAI API key
- Selected model
- Custom extraction fields
- Custom prompt

When adding new features that require persistence, follow the pattern in the existing utility files.

## Supabase Integration

The application is integrated with Supabase for backend functionality. To use Supabase features:

1. Connect to your Supabase project by updating the client in `src/integrations/supabase/client.ts`
2. Use the Supabase client for data storage, authentication, or other backend needs
