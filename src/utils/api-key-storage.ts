
// Utility functions to handle API key storage securely in browser storage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('openai_api_key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

export const removeApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
};
