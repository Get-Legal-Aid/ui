import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  useGetCaseNotes, 
  useCreateCaseNote, 
  useUpdateCaseNote, 
  useDeleteCaseNote 
} from "@/services/cases/cases.hooks";
import { useAuth } from "@/contexts/auth-context";
import type { CaseNote } from "@/services/cases/cases.types";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Lock 
} from "lucide-react";
import { toast } from "sonner";

interface CaseNotesProps {
  caseId: string;
  canManage: boolean;
}

export function CaseNotes({ caseId, canManage }: CaseNotesProps) {
  const { user } = useAuth();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<CaseNote | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteIsPrivate, setNewNoteIsPrivate] = useState(false);

  const { data: notesData, isLoading } = useGetCaseNotes(caseId, {
    limit: 20,
    sortOrder: "desc",
  });

  const { mutateAsync: createNote, isPending: isCreating } = useCreateCaseNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateCaseNote();
  const { mutateAsync: deleteNote, isPending: isDeleting } = useDeleteCaseNote();

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      await createNote({
        caseId,
        data: {
          content: newNoteContent.trim(),
          isPrivate: newNoteIsPrivate,
        },
      });
      
      toast.success("Note added successfully");
      setNewNoteContent("");
      setNewNoteIsPrivate(false);
      setIsAddingNote(false);
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.content.trim()) return;

    try {
      await updateNote({
        caseId,
        noteId: editingNote.id,
        data: {
          content: editingNote.content.trim(),
          isPrivate: editingNote.isPrivate,
        },
      });
      
      toast.success("Note updated successfully");
      setEditingNote(null);
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote({ caseId, noteId });
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const canEditNote = (note: CaseNote) => {
    return user && (user.role === "ADMIN" || user.id === note.authorId);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Case Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const notes = notesData?.notes || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Case Notes ({notes.length})
          </CardTitle>
          
          {canManage && (
            <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Case Note</DialogTitle>
                  <DialogDescription>
                    Add a note to track progress or share information about this case.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={4}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private"
                      checked={newNoteIsPrivate}
                      onCheckedChange={(checked: boolean) => setNewNoteIsPrivate(checked)}
                    />
                    <label
                      htmlFor="private"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Private note (only visible to you and admins)
                    </label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingNote(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNote}
                    disabled={!newNoteContent.trim() || isCreating}
                  >
                    {isCreating ? "Adding..." : "Add Note"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notes yet.</p>
            {canManage && (
              <p className="text-sm">Add the first note to start tracking progress.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note, index) => (
              <div key={note.id}>
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(note.author.firstName, note.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {note.author.firstName} {note.author.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {note.author.role}
                        </Badge>
                        {note.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </span>
                        
                        {canEditNote(note) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditingNote({ ...note })}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteNote(note.id)}
                                disabled={isDeleting}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </div>
                    
                    {note.createdAt !== note.updatedAt && (
                      <div className="text-xs text-muted-foreground">
                        Edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
                
                {index < notes.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Note Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>
                Update your note content or privacy settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                rows={4}
              />
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-private"
                  checked={editingNote.isPrivate}
                  onCheckedChange={(checked: boolean) => 
                    setEditingNote({ ...editingNote, isPrivate: checked })
                  }
                />
                <label
                  htmlFor="edit-private"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Private note (only visible to you and admins)
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateNote}
                disabled={!editingNote.content.trim() || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}