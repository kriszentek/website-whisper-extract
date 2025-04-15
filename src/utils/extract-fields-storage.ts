
import { ExtractField } from "@/types";
import { DEFAULT_EXTRACT_FIELDS } from "./constants";
import { fetchExtractFields, addExtractField as addField, removeExtractField as removeField } from "@/services/extract-fields-service";

export const getExtractFields = async (): Promise<ExtractField[]> => {
  try {
    const customFields = await fetchExtractFields();
    return [...DEFAULT_EXTRACT_FIELDS, ...customFields];
  } catch (error) {
    console.error('Error getting extract fields:', error);
    return DEFAULT_EXTRACT_FIELDS;
  }
};

export const addExtractField = async (field: ExtractField): Promise<void> => {
  await addField(field);
};

export const removeExtractField = async (fieldId: string): Promise<void> => {
  await removeField(fieldId);
};
