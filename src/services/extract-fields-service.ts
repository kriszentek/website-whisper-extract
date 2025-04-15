
import { ExtractField } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export async function fetchExtractFields(): Promise<ExtractField[]> {
  const { data, error } = await supabase
    .from('extract_fields')
    .select('field_id, name')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching extract fields:', error);
    return [];
  }

  return data.map(field => ({
    id: field.field_id,
    name: field.name
  }));
}

export async function addExtractField(field: ExtractField): Promise<boolean> {
  const { error } = await supabase
    .from('extract_fields')
    .insert([{
      field_id: field.id,
      name: field.name
    }]);

  if (error) {
    console.error('Error adding extract field:', error);
    return false;
  }

  return true;
}

export async function removeExtractField(fieldId: string): Promise<boolean> {
  const { error } = await supabase
    .from('extract_fields')
    .delete()
    .eq('field_id', fieldId);

  if (error) {
    console.error('Error removing extract field:', error);
    return false;
  }

  return true;
}
