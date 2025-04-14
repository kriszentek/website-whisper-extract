
# Utilities Documentation

## API Key Storage (`src/utils/api-key-storage.ts`)

Manages the storage and retrieval of OpenAI model settings and custom prompts via Supabase.

### Functions:

- `saveModel(model: string)`: Stores the selected OpenAI model in Supabase
- `getModel()`: Retrieves the stored model from Supabase (defaults to 'gpt-4o')
- `saveCustomPrompt(prompt: string | null)`: Stores a custom prompt in Supabase
- `getCustomPrompt()`: Retrieves the stored custom prompt from Supabase

> Note: Legacy API key functions (`saveApiKey`, `getApiKey`, `hasApiKey`, `removeApiKey`) are maintained for backwards compatibility but no longer store actual keys as the application now uses a server-side API key stored in Supabase environment variables.

### Implementation Details:

```typescript
// Supabase integration for storing model preferences and custom prompts
export const saveModel = async (model: string): Promise<void> => {
  const { error } = await supabase
    .from('app_settings')
    .update({ value: model })
    .eq('id', 'openai_default_model');
  
  if (error) {
    console.error('Error saving model:', error);
  }
};

export const getModel = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('id', 'openai_default_model')
    .single();
  
  if (error) {
    console.error('Error retrieving model:', error);
    return 'gpt-4o'; // Default fallback
  }
  
  return data?.value || 'gpt-4o';
};
```

## Extract Fields Storage (`src/utils/extract-fields-storage.ts`)

Manages the storage and retrieval of custom extraction fields using local storage.

### Functions:

- `getExtractFields()`: Retrieves stored fields or returns defaults
- `addExtractField(field: ExtractField)`: Adds a new custom field
- `removeExtractField(fieldId: string)`: Removes a custom field

### Implementation Details:

The utility uses browser local storage to persist custom fields:

```typescript
const STORAGE_KEY = 'website-whisper-extract-fields';

export function getExtractFields(): ExtractField[] {
  const fieldsJson = localStorage.getItem(STORAGE_KEY);
  if (!fieldsJson) {
    return DEFAULT_EXTRACT_FIELDS;
  }

  try {
    return JSON.parse(fieldsJson);
  } catch (e) {
    console.error('Error parsing extract fields from localStorage:', e);
    return DEFAULT_EXTRACT_FIELDS;
  }
}
```

## Constants (`src/utils/constants.ts`)

Contains default values and constants used throughout the application.

### Key Constants:

- `DEFAULT_EXTRACT_FIELDS`: The default fields to extract from websites

```typescript
export const DEFAULT_EXTRACT_FIELDS: ExtractField[] = [
  { id: 'company_name', name: 'Company Name' },
  { id: 'industry', name: 'Industry' },
  { id: 'products_services', name: 'Products/Services' },
  { id: 'target_audience', name: 'Target Audience' },
  { id: 'company_size', name: 'Company Size' },
  { id: 'founded_year', name: 'Founded Year' },
  { id: 'headquarters', name: 'Headquarters' },
  { id: 'key_differentiators', name: 'Key Differentiators' }
];
```

These utilities work together to provide a seamless user experience while maintaining separation of concerns:

1. `api-key-storage.ts` manages model preferences and custom prompts
2. `extract-fields-storage.ts` manages custom extraction fields
3. `constants.ts` provides default values used throughout the application

This modular approach makes the application more maintainable and easier to extend with new features.
