
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";
import { fetchExtractFields, addExtractField as addField, removeExtractField as removeField } from "@/services/extract-fields-service";

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    const customFields = await fetchExtractFields();
    console.log('Retrieved fields from Supabase:', customFields);
    
    // Combine default fields with custom fields, preventing duplicates
    const combinedFields = [
      ...DEFAULT_EXTRACT_FIELDS, 
      ...customFields.filter(cf => 
        !DEFAULT_EXTRACT_FIELDS.some(df => df.id === cf.id)
      )
    ];
    
    return combinedFields;
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
