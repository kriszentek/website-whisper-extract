
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ExtractField } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CustomFieldsManagerProps {
  fields: ExtractField[];
  defaultFields: ExtractField[];
  onAddField: (field: ExtractField) => void;
  onRemoveField: (id: string) => void;
}

export default function CustomFieldsManager({ 
  fields, 
  defaultFields,
  onAddField, 
  onRemoveField 
}: CustomFieldsManagerProps) {
  const [newFieldName, setNewFieldName] = useState("");
  const [customFields, setCustomFields] = useState<ExtractField[]>([]);
  
  // Filter out default fields to get only custom fields when fields prop changes
  useEffect(() => {
    const filtered = fields.filter(
      field => !defaultFields.some(df => df.id === field.id)
    );
    setCustomFields(filtered);
    console.log('Custom fields in manager:', filtered);
  }, [fields, defaultFields]);

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      toast.error("Please enter a field name");
      return;
    }

    // Create a simple ID from the name
    const fieldId = `custom_${newFieldName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    const newField = {
      id: fieldId,
      name: newFieldName.trim()
    };
    
    onAddField(newField);
    setNewFieldName("");
    
    // Immediately add the field to the local state for instant UI feedback
    setCustomFields(prev => [...prev, newField]);
    
    toast.success(`Added field: ${newFieldName}`);
  };

  const handleRemoveField = (id: string) => {
    onRemoveField(id);
    
    // Immediately remove from local state for instant UI feedback
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Custom Information Fields</CardTitle>
        <CardDescription>
          Add custom fields to extract from company websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newField">Add New Field</Label>
            <div className="flex space-x-2">
              <Input
                id="newField"
                placeholder="e.g., Sub-industry, CEO name, founding year, etc."
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddField();
                  }
                }}
              />
              <Button onClick={handleAddField} className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          
          {customFields.length > 0 ? (
            <div className="space-y-2">
              <Label>Custom Fields</Label>
              <div className="space-y-2">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between border p-2 rounded-md">
                    <span>{field.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveField(field.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pt-2">
              No custom fields added yet. Default fields will always be included.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
