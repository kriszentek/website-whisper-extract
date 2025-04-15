import { useState } from "react";
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
  
  // Filter out default fields to get only custom fields
  const customFields = fields.filter(
    field => !defaultFields.some(df => df.id === field.id)
  );

  const handleAddField = async () => {
    if (!newFieldName.trim()) {
      toast.error("Please enter a field name");
      return;
    }

    // Create a simple ID from the name
    const fieldId = `custom_${newFieldName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    await onAddField({
      id: fieldId,
      name: newFieldName.trim()
    });
    
    setNewFieldName("");
    toast.success(`Added new field: ${newFieldName}`);
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
                placeholder="e.g., CEO name, founding year, etc."
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1"
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
                      onClick={() => {
                        onRemoveField(field.id);
                        toast.info(`Removed field: ${field.name}`);
                      }}
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
