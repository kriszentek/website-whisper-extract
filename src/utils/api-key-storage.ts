
// Utility functions to handle model and prompt storage in browser storage

// Add functions to manage saved model
export const saveModel = (model: string): void => {
  localStorage.setItem('openai_model', model);
};

export const getModel = (): string => {
  return localStorage.getItem('openai_model') || 'gpt-4o'; // Default to gpt-4o
};

// Add function to manage custom prompt
export const saveCustomPrompt = (prompt: string | null): void => {
  if (prompt) {
    localStorage.setItem('openai_custom_prompt', prompt);
  } else {
    localStorage.removeItem('openai_custom_prompt');
  }
};

export const getCustomPrompt = (): string | null => {
  return localStorage.getItem('openai_custom_prompt');
};

// These are kept for backward compatibility but are no longer used
export const saveApiKey = (): void => {};
export const getApiKey = (): string => { return "server-managed"; };
export const hasApiKey = (): boolean => { return true; }; 
export const removeApiKey = (): void => {};
