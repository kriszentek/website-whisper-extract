
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";
import { fetchExtractFields, addExtractField as addField, removeExtractField as removeField } from "@/services/extract-fields-service";

// Storage key
const STORAGE_KEY = 'website-whisper-extract-fields';

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    // Get custom fields from localStorage via service
    const customFields = await fetchExtractFields();
    console.log('Retrieved fields from localStorage:', customFields);
    
    // Combine with default fields
    return [...DEFAULT_EXTRACT_FIELDS, ...customFields];
  } catch (error) {
    console.error('Error fetching extract fields:', error);
    return DEFAULT_EXTRACT_FIELDS;
  }
};

export const addExtractField = async (field: ExtractField): Promise<void> => {
  try {
    const success = await addField(field);
    
    if (success) {
      console.log('Field added successfully:', field);
    } else {
      console.error('Failed to add field');
    }
  } catch (error) {
    console.error('Failed to add field:', error);
  }
};

export const removeExtractField = async (fieldId: string): Promise<void> => {
  try {
    const success = await removeField(fieldId);
    
    if (success) {
      console.log('Field removed successfully:', fieldId);
    } else {
      console.error('Failed to remove field');
    }
  } catch (error) {
    console.error('Failed to remove field:', error);
  }
};
