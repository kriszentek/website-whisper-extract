
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";
import { fetchExtractFields, addExtractField as addField, removeExtractField as removeField } from "@/services/extract-fields-service";

// For fallback storage when Supabase operations fail
const STORAGE_KEY = 'website-whisper-extract-fields';

// Helper functions for local storage
const saveLocalFields = (fields: ExtractField[]): void => {
  // Only save non-default custom fields to local storage
  const customFields = fields.filter(
    field => !DEFAULT_EXTRACT_FIELDS.some(df => df.id === field.id)
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customFields));
};

const getLocalFields = (): ExtractField[] => {
  const fieldsJson = localStorage.getItem(STORAGE_KEY);
  if (!fieldsJson) {
    return [];
  }

  try {
    return JSON.parse(fieldsJson);
  } catch (e) {
    console.error('Error parsing extract fields from localStorage:', e);
    return [];
  }
};

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    const customFields = await fetchExtractFields();
    return [...DEFAULT_EXTRACT_FIELDS, ...customFields];
  } catch (error) {
    console.error('Error getting extract fields from database:', error);
    // Fallback to local storage
    const localFields = getLocalFields();
    return [...DEFAULT_EXTRACT_FIELDS, ...localFields];
  }
};

export const addExtractField = async (field: ExtractField): Promise<void> => {
  try {
    const success = await addField(field);
    if (!success) {
      throw new Error("Failed to add field to database");
    }
  } catch (error) {
    console.error('Fallback to local storage for adding field:', error);
    // Fallback to local storage
    const currentFields = getLocalFields();
    const newFields = [...currentFields, field];
    saveLocalFields(newFields);
  }
};

export const removeExtractField = async (fieldId: string): Promise<void> => {
  try {
    const success = await removeField(fieldId);
    if (!success) {
      throw new Error("Failed to remove field from database");
    }
  } catch (error) {
    console.error('Fallback to local storage for removing field:', error);
    // Fallback to local storage
    const currentFields = getLocalFields();
    const newFields = currentFields.filter(f => f.id !== fieldId);
    saveLocalFields(newFields);
  }
};
