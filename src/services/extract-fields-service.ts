
import { ExtractField } from "@/types";

// These functions are kept as placeholders but will use localStorage exclusively
export async function fetchExtractFields(): Promise<ExtractField[]> {
  try {
    // Get fields from localStorage
    const fieldsJson = localStorage.getItem('website-whisper-extract-fields');
    if (!fieldsJson) {
      return [];
    }
    
    return JSON.parse(fieldsJson);
  } catch (error) {
    console.error('Failed to fetch extract fields from localStorage:', error);
    return [];
  }
}

export async function addExtractField(field: ExtractField): Promise<boolean> {
  try {
    // Get existing fields
    const fieldsJson = localStorage.getItem('website-whisper-extract-fields');
    const fields = fieldsJson ? JSON.parse(fieldsJson) : [];
    
    // Add new field
    fields.push(field);
    
    // Save back to localStorage
    localStorage.setItem('website-whisper-extract-fields', JSON.stringify(fields));
    
    return true;
  } catch (error) {
    console.error('Failed to add extract field to localStorage:', error);
    return false;
  }
}

export async function removeExtractField(fieldId: string): Promise<boolean> {
  try {
    // Get existing fields
    const fieldsJson = localStorage.getItem('website-whisper-extract-fields');
    if (!fieldsJson) {
      return true; // Nothing to remove
    }
    
    const fields = JSON.parse(fieldsJson);
    
    // Filter out the field to remove
    const updatedFields = fields.filter((f: ExtractField) => f.id !== fieldId);
    
    // Save back to localStorage
    localStorage.setItem('website-whisper-extract-fields', JSON.stringify(updatedFields));
    
    return true;
  } catch (error) {
    console.error('Failed to remove extract field from localStorage:', error);
    return false;
  }
}
