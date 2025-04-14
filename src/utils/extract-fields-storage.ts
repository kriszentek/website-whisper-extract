
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";

// Handles storage and retrieval of custom extraction fields
const STORAGE_KEY = 'website_whisper_fields';

export const getExtractFields = (): ExtractField[] => {
  const storedFields = localStorage.getItem(STORAGE_KEY);
  if (!storedFields) {
    return DEFAULT_EXTRACT_FIELDS;
  }
  
  try {
    const customFields = JSON.parse(storedFields) as ExtractField[];
    return [...DEFAULT_EXTRACT_FIELDS, ...customFields];
  } catch (error) {
    console.error('Error parsing stored fields:', error);
    return DEFAULT_EXTRACT_FIELDS;
  }
};

export const addExtractField = (field: ExtractField): void => {
  const storedFields = localStorage.getItem(STORAGE_KEY);
  let customFields: ExtractField[] = [];
  
  if (storedFields) {
    try {
      customFields = JSON.parse(storedFields) as ExtractField[];
    } catch (error) {
      console.error('Error parsing stored fields:', error);
    }
  }
  
  // Check if field with this ID already exists
  if (!customFields.some(f => f.id === field.id)) {
    customFields.push(field);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customFields));
  }
};

export const removeExtractField = (fieldId: string): void => {
  const storedFields = localStorage.getItem(STORAGE_KEY);
  if (!storedFields) return;
  
  try {
    const customFields = JSON.parse(storedFields) as ExtractField[];
    const updatedFields = customFields.filter(field => field.id !== fieldId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFields));
  } catch (error) {
    console.error('Error parsing stored fields:', error);
  }
};
