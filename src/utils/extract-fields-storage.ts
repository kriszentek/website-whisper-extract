
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";
import { fetchExtractFields, addExtractField as addField, removeExtractField as removeField } from "@/services/extract-fields-service";

// For storage when Supabase operations fail
const STORAGE_KEY = 'website-whisper-extract-fields';

// Helper functions for local storage
const saveLocalFields = (fields: ExtractField[]): void => {
  try {
    // Only save custom fields to local storage (not default fields)
    const customFields = fields.filter(
      field => !DEFAULT_EXTRACT_FIELDS.some(df => df.id === field.id)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customFields));
  } catch (e) {
    console.error('Error saving fields to localStorage:', e);
  }
};

const getLocalFields = (): ExtractField[] => {
  try {
    const fieldsJson = localStorage.getItem(STORAGE_KEY);
    if (!fieldsJson) {
      return [];
    }
    return JSON.parse(fieldsJson);
  } catch (e) {
    console.error('Error parsing extract fields from localStorage:', e);
    return [];
  }
};

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    // Try to get fields from Supabase first
    const customFields = await fetchExtractFields();
    console.log('Retrieved fields from Supabase:', customFields);
    return [...DEFAULT_EXTRACT_FIELDS, ...customFields];
  } catch (error) {
    console.error('Falling back to local storage for extract fields:', error);
    // Fallback to local storage
    const localFields = getLocalFields();
    console.log('Retrieved fields from local storage:', localFields);
    return [...DEFAULT_EXTRACT_FIELDS, ...localFields];
  }
};

export const addExtractField = async (field: ExtractField): Promise<void> => {
  // Always save to local storage first (as backup)
  const localFields = getLocalFields();
  const newLocalFields = [...localFields, field];
  saveLocalFields(newLocalFields);
  
  try {
    // Then try to save to Supabase
    await addField(field);
    console.log('Field added to Supabase successfully:', field);
  } catch (error) {
    console.error('Failed to add field to Supabase (using local storage fallback):', error);
    // Already saved to local storage above, so we're good
  }
};

export const removeExtractField = async (fieldId: string): Promise<void> => {
  // Update local storage first
  const localFields = getLocalFields();
  const updatedLocalFields = localFields.filter(f => f.id !== fieldId);
  saveLocalFields(updatedLocalFields);
  
  try {
    // Then try to remove from Supabase
    await removeField(fieldId);
    console.log('Field removed from Supabase successfully:', fieldId);
  } catch (error) {
    console.error('Failed to remove field from Supabase (using local storage fallback):', error);
    // Already updated local storage above, so we're good
  }
};
