
// Utility functions to handle model and prompt storage using Supabase

import { supabase } from "@/integrations/supabase/client";

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

export const saveCustomPrompt = async (prompt: string | null): Promise<void> => {
  const { error } = await supabase
    .from('app_settings')
    .update({ value: prompt || '' })
    .eq('id', 'openai_custom_prompt');
  
  if (error) {
    console.error('Error saving custom prompt:', error);
  }
};

export const getCustomPrompt = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('id', 'openai_custom_prompt')
    .single();
  
  if (error) {
    console.error('Error retrieving custom prompt:', error);
    return null;
  }
  
  return data?.value || null;
};

// Kept for backward compatibility
export const saveApiKey = (): void => {};
export const getApiKey = (): string => { return "server-managed"; };
export const hasApiKey = (): boolean => { return true; }; 
export const removeApiKey = (): void => {};
