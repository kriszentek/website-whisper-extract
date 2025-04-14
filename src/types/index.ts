
export interface ExtractedInfo {
  name: string;
  value: string | null;
}

export interface ExtractField {
  id: string;
  name: string;
}

export interface CompanyData {
  website: string;
  info: ExtractedInfo[];
  timestamp: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Add available OpenAI models
export type OpenAIModel = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4.5-preview';

export interface ApiKeyFormProps {
  onModelChange?: (model: OpenAIModel) => void;
}

// New prompt editor props
export interface PromptEditorProps {
  onPromptChange: (prompt: string | null) => void;
  defaultPrompt: string;
  website: string;
  fields: ExtractField[];
}
