import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, Plus, Lock, Unlock, Edit, Trash2 } from "lucide-react";
import { useGetCaseNotes, useDeleteCaseNote, useGetCaseById } from "@/services/cases/cases.hooks";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { CreateNoteForm } from "./components/create-note-form";
import { toast } from "sonner";
import type { CaseNote } from "@/services/cases/cases.types";

export default function CaseNotesPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<CaseNote | null>(null);
  
  const { data: notesData, isLoading } = useGetCaseNotes(caseId!, { limit: 50 });
  const { data: caseData } = useGetCaseById(caseId!);
  const { mutateAsync: deleteNote } = useDeleteCaseNote();

  // Check if current user can manage this case (is assigned to it)
  const canManageCase = user && caseData && (
    user.role === "ADMIN" || 
    (caseData.assignedToId === user.id && user.role === "LAWYER")
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote({ caseId: caseId!, noteId });
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  if (!caseId) {
    return <div>Case not found</div>;
  }

  // Show access denied for users who can't manage the case
  if (caseData && !canManageCase) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Cases", href: "/cases" },
            { label: caseData?.title || "Case", href: `/cases/${caseId}` },
            { label: "Case Notes", isCurrentPage: true },
          ]}
        />
        
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
              <p>You can only view and create notes for cases you are assigned to.</p>
              <Button asChild className="mt-4">
                <Link to={`/cases/${caseId}`}>
                  Back to Case Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/cases/${caseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateForm || editingNote) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Cases", href: "/cases" },
            { label: caseData?.title || "Case", href: `/cases/${caseId}` },
            { label: "Case Notes", href: `/cases/${caseId}/notes` },
            { label: editingNote ? "Edit Note" : "Add Note", isCurrentPage: true },
          ]}
        />
        
        <CreateNoteForm 
          caseId={caseId} 
          existingNote={editingNote}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingNote(null);
          }}
        />
      </div>
    );
  }

  const notes = notesData?.notes || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageBreadcrumb
            items={[
              { label: "Cases", href: "/cases" },
              { label: caseData?.title || "Case", href: `/cases/${caseId}` },
              { label: "Case Notes", isCurrentPage: true },
            ]}
          />
          <div className="mt-2">
            <h1 className="text-2xl font-bold">Case Notes</h1>
            <p className="text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>

        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notes yet</h3>
              <p>Add the first note to start documenting case progress.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const canEdit = user?.id === note.author.id;
            
            return (
              <Card key={note.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(note.author.firstName, note.author.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
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
                          {!note.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                              <Unlock className="h-3 w-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          {note.createdAt !== note.updatedAt && (
                            <span> • Edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {canEdit && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {note.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}