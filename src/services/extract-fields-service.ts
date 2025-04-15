
import { supabase } from "@/integrations/supabase/client";
import { ExtractField } from "@/types";

export async function fetchExtractFields(): Promise<ExtractField[]> {
  try {
    const { data, error } = await supabase
      .from('extract_fields')
      .select('*');
    
    if (error) {
      console.error('Failed to fetch extract fields:', error);
      return [];
    }
    
    // Map database fields to ExtractField type
    return data ? data.map(item => ({
      id: item.field_id,
      name: item.name
    })) : [];
  } catch (error) {
    console.error('Unexpected error fetching extract fields:', error);
    return [];
  }
}

export async function addExtractField(field: ExtractField): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('extract_fields')
      .insert({ 
        field_id: field.id, 
        name: field.name 
      });
    
    if (error) {
      console.error('Failed to add extract field:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error adding extract field:', error);
    return false;
  }
}

export async function removeExtractField(fieldId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('extract_fields')
      .delete()
      .eq('field_id', fieldId);
    
    if (error) {
      console.error('Failed to remove extract field:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error removing extract field:', error);
    return false;
  }
}
