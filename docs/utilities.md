
# Utilities Documentation

## API Key Storage (`src/utils/api-key-storage.ts`)

Manages the storage and retrieval of the OpenAI API key and related settings in the browser's local storage.

### Functions:

- `saveApiKey(apiKey: string)`: Securely stores the API key in local storage
- `getApiKey()`: Retrieves the stored API key
- `hasApiKey()`: Checks if an API key exists
- `removeApiKey()`: Removes the stored API key
- `saveModel(model: string)`: Stores the selected OpenAI model
- `getModel()`: Retrieves the stored model (defaults to 'gpt-4o')
- `saveCustomPrompt(prompt: string | null)`: Stores a custom prompt
- `getCustomPrompt()`: Retrieves the stored custom prompt

## Extract Fields Storage (`src/utils/extract-fields-storage.ts`)

Manages the storage and retrieval of custom extraction fields.

### Functions:

- `getExtractFields()`: Retrieves stored fields or returns defaults
- `addExtractField(field: ExtractField)`: Adds a new custom field
- `removeExtractField(fieldId: string)`: Removes a custom field

## Constants (`src/utils/constants.ts`)

Contains default values and constants used throughout the application.

### Key Constants:

- `DEFAULT_EXTRACT_FIELDS`: The default fields to extract from websites
