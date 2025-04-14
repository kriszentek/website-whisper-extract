
# Components Documentation

## Main Components

### Index Page (`src/pages/Index.tsx`)

The main application page that orchestrates all the components and manages the application state. It contains:

- Tabs for navigation between Analyze and Customize sections
- State management for the extraction process
- Integration with the OpenAI service
- Error handling and user feedback

### WebsiteForm (`src/components/WebsiteForm.tsx`)

Responsible for collecting the website URL from the user:

- Validates URLs before submission
- Normalizes URLs (adds https:// if missing)
- Provides user feedback via toast messages
- Offers access to the prompt editor

### ResultsCard (`src/components/ResultsCard.tsx`) 

Displays the extracted information:

- Shows loading state while extraction is in progress
- Presents extracted data in a structured format
- Handles empty states and displays timestamps
- Formats data for readability

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
- Provides context for the current website being analyzed

## UI Components

The application uses shadcn/ui components for the user interface, providing a consistent and accessible design system:

- **Tabs**: Navigation between different sections of the application
- **Button**: User actions such as submitting forms and adding fields
- **Card**: Displaying structured information and forms
- **Input**: Collecting user input like website URLs
- **Alert**: Displaying error messages and important information
- **Badge**: Highlighting special features or statuses
- **Separator**: Visual separation between content sections
- **Toast**: Providing user feedback for actions and errors

## State Management

The Index page manages several key pieces of state:

- `companyData`: The extracted information from the website
- `isLoading`: Loading state during API requests
- `extractFields`: Fields to extract from websites
- `website`: The current website URL
- `customPrompt`: User-defined prompt for extraction
- `apiError`: Any error messages from the API

## Component Interactions

1. User enters a website URL in `WebsiteForm`
2. On submit, the `Index` component calls the OpenAI service
3. While waiting, `ResultsCard` displays a loading state
4. Once data is received, it's displayed in `ResultsCard`
5. If errors occur, they're displayed in an `Alert` component

Users can also:
- Customize extraction fields using `CustomFieldsManager`
- Edit the extraction prompt using `PromptEditor`

This component architecture ensures separation of concerns and makes the application more maintainable and extensible.
