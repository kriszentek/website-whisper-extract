
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";

const STORAGE_KEY = 'website-whisper-extract-fields';

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    console.log('Getting extract fields from localStorage');
    
    // Get custom fields from local storage
    const storedFields = localStorage.getItem(STORAGE_KEY);
    let customFields: ExtractField[] = storedFields ? JSON.parse(storedFields) : [];
    
    // Combine default fields with custom fields, preventing duplicates
    const combinedFields = [
      ...DEFAULT_EXTRACT_FIELDS, 
      ...customFields.filter(cf => 
        !DEFAULT_EXTRACT_FIELDS.some(df => df.id === cf.id)
      )
    ];
    
    console.log('Combined fields:', combinedFields);
    return combinedFields;
  } catch (error) {
    console.error('Error fetching extract fields:', error);
    return DEFAULT_EXTRACT_FIELDS;
  }
};

export const addExtractField = async (field: ExtractField): Promise<void> => {
  try {
    console.log('Adding extract field to localStorage:', field);
    
    // Get existing fields
    const storedFields = localStorage.getItem(STORAGE_KEY);
    let fields: ExtractField[] = storedFields ? JSON.parse(storedFields) : [];
    
    // Add new field
    fields.push(field);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    
    console.log('Field added successfully:', field);
  } catch (error) {
    console.error('Failed to add field:', error);
  }
};

export const removeExtractField = async (fieldId: string): Promise<void> => {
  try {
    console.log('Removing extract field from localStorage, id:', fieldId);
    
    // Get existing fields
    const storedFields = localStorage.getItem(STORAGE_KEY);
    let fields: ExtractField[] = storedFields ? JSON.parse(storedFields) : [];
    
    // Filter out the field to remove
    fields = fields.filter(field => field.id !== fieldId);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    
    console.log('Field removed successfully:', fieldId);
  } catch (error) {
    console.error('Failed to remove field:', error);
  }
};
