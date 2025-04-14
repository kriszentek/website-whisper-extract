
# Components Documentation

## Main Components

### Index Page (`src/pages/Index.tsx`)

The main application page that orchestrates all the components and manages the application state. It contains:

- Tabs for navigation between Analyze, Customize, and Settings sections
- State management for the extraction process
- Integration with the OpenAI service
- Error handling and user feedback

### WebsiteForm (`src/components/WebsiteForm.tsx`)

Responsible for collecting the website URL from the user:

- Validates URLs before submission
- Checks for API key availability
- Normalizes URLs (adds https:// if missing)
- Provides user feedback via toast messages

### ResultsCard (`src/components/ResultsCard.tsx`) 

Displays the extracted information:

- Shows loading state while extraction is in progress
- Presents extracted data in a structured format
- Handles empty states and displays timestamps

### ApiKeyForm (`src/components/ApiKeyForm.tsx`)

Manages the OpenAI API key and model selection:

- Securely stores API key in local storage
- Provides model selection options
- Validates API key format

### CustomFieldsManager (`src/components/CustomFieldsManager.tsx`)

Allows users to customize the fields to extract:

- Add custom fields
- Remove custom fields
- Preserves default fields
- Persists custom fields to local storage

### PromptEditor (`src/components/PromptEditor.tsx`)

Enables users to customize the prompt sent to OpenAI:

- Edit and save custom prompts
- Reset to default prompt
- Dynamically generates default prompts based on selected fields

## UI Components

The application uses shadcn/ui components for the user interface, providing a consistent and accessible design system.
