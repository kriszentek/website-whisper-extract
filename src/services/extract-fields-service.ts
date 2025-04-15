
import { ExtractField } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export async function fetchExtractFields(): Promise<ExtractField[]> {
  try {
    const { data, error } = await supabase
      .from('extract_fields')
      .select('field_id, name')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching extract fields:', error);
      throw error;
    }

    return data.map(field => ({
      id: field.field_id,
      name: field.name
    }));
  } catch (error) {
    console.error('Failed to fetch extract fields:', error);
    throw error;
  }
}

export async function addExtractField(field: ExtractField): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('extract_fields')
      .insert([{
        field_id: field.id,
        name: field.name
      }]);

    if (error) {
      console.error('Error adding extract field:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to add extract field:', error);
    throw error;
  }
}

export async function removeExtractField(fieldId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('extract_fields')
      .delete()
      .eq('field_id', fieldId);

    if (error) {
      console.error('Error removing extract field:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to remove extract field:', error);
    throw error;
  }
}
