import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCaseNote, useUpdateCaseNote } from "@/services/cases/cases.hooks";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { CaseNote } from "@/services/cases/cases.types";
import type { ApiError } from "@/services/auth/auth.types";

interface CreateNoteFormProps {
  caseId: string;
  existingNote?: CaseNote | null;
  onSuccess: () => void;
}

export function CreateNoteForm({ caseId, existingNote, onSuccess }: CreateNoteFormProps) {
  const [formData, setFormData] = useState({
    content: existingNote?.content || "",
    isPrivate: existingNote?.isPrivate ?? true,
  });

  const { mutateAsync: createNote, isPending: isCreating } = useCreateCaseNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateCaseNote();
  
  const isPending = isCreating || isUpdating;
  const isEditing = !!existingNote;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast.error("Please enter note content");
      return;
    }

    try {
      if (isEditing) {
        await updateNote({
          caseId,
          noteId: existingNote.id,
          data: {
            content: formData.content.trim(),
            isPrivate: formData.isPrivate,
          },
        });
        toast.success("Note updated successfully");
      } else {
        await createNote({
          caseId,
          data: {
            content: formData.content.trim(),
            isPrivate: formData.isPrivate,
          },
        });
        toast.success("Note created successfully");
      }
      
      onSuccess();
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || (isEditing ? "Failed to update note" : "Failed to create note"));
      } else {
        toast.error(isEditing ? "Failed to update note" : "Failed to create note");
      }
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Note" : "Add New Note"}
        </CardTitle>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Update your note for this case."
            : "Add a note to document case progress, observations, or important information."
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Note Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter your note here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="min-h-[250px]"
              required
            />
            <p className="text-sm text-muted-foreground">
              Document case progress, client communications, legal research, or any other relevant information.
            </p>
          </div>
          
          {/* Privacy Setting */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isPrivate: checked === true })
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="isPrivate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Private Note
              </Label>
              <p className="text-xs text-muted-foreground">
                Private notes are only visible to you. Uncheck to share with other case participants.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.content.trim() || isPending}
            >
              {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Note" : "Create Note")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}