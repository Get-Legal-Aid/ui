import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useGetCaseTimeline, 
  useCreateTimelineUpdate 
} from "@/services/cases/cases.hooks";
import type { TimelineUpdateType } from "@/services/cases/cases.types";
import { formatDistanceToNow } from "date-fns";
import { 
  Clock, 
  Plus,
  CheckCircle,
  AlertCircle,
  User,
  Gavel,
  UserCheck,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface CaseTimelineViewProps {
  caseId: string;
  canManage: boolean;
}

const updateTypeIcons = {
  PICKED_UP: <UserCheck className="h-4 w-4" />,
  STATUS_CHANGED: <AlertCircle className="h-4 w-4" />,
  NOTE_ADDED: <MessageSquare className="h-4 w-4" />,
  REVIEW_ADDED: <BookOpen className="h-4 w-4" />,
  LAWYER_SUGGESTED: <User className="h-4 w-4" />,
  RESOLVED: <CheckCircle className="h-4 w-4" />,
  CLOSED: <Gavel className="h-4 w-4" />,
};

const updateTypeColors = {
  PICKED_UP: "bg-blue-100 text-blue-800 border-blue-200",
  STATUS_CHANGED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  NOTE_ADDED: "bg-gray-100 text-gray-800 border-gray-200",
  REVIEW_ADDED: "bg-purple-100 text-purple-800 border-purple-200",
  LAWYER_SUGGESTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-slate-100 text-slate-800 border-slate-200",
};

export function CaseTimelineView({ caseId, canManage }: CaseTimelineViewProps) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    updateType: "STATUS_CHANGED" as TimelineUpdateType,
  });

  const { data: timelineData, isLoading } = useGetCaseTimeline(caseId, {
    limit: 50,
    sortOrder: "desc",
  });

  const { mutateAsync: createUpdate, isPending: isCreating } = useCreateTimelineUpdate();

  const handleCreateUpdate = async () => {
    if (!newUpdate.title.trim()) return;

    try {
      await createUpdate({
        caseId,
        data: {
          title: newUpdate.title.trim(),
          description: newUpdate.description.trim() || undefined,
          updateType: newUpdate.updateType,
        },
      });
      
      toast.success("Timeline update added successfully");
      setNewUpdate({
        title: "",
        description: "",
        updateType: "STATUS_CHANGED",
      });
      setIsAddingUpdate(false);
    } catch (error) {
      toast.error("Failed to add timeline update");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Case Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const updates = timelineData?.updates || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Case Updates ({updates.length})
          </CardTitle>
          
          {canManage && (
            <Dialog open={isAddingUpdate} onOpenChange={setIsAddingUpdate}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Timeline Update</DialogTitle>
                  <DialogDescription>
                    Add a progress update to the case timeline.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Update Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Client meeting scheduled"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="updateType">Update Type</Label>
                    <Select
                      value={newUpdate.updateType}
                      onValueChange={(value) => 
                        setNewUpdate({ ...newUpdate, updateType: value as TimelineUpdateType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STATUS_CHANGED">Status Changed</SelectItem>
                        <SelectItem value="NOTE_ADDED">Note Added</SelectItem>
                        <SelectItem value="REVIEW_ADDED">Review Added</SelectItem>
                        <SelectItem value="LAWYER_SUGGESTED">Lawyer Suggested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional details about this update..."
                      value={newUpdate.description}
                      onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingUpdate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUpdate}
                    disabled={!newUpdate.title.trim() || isCreating}
                  >
                    {isCreating ? "Adding..." : "Add Update"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {updates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No timeline updates yet.</p>
            <p className="text-sm">Updates will appear here as the case progresses.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-6">
              {updates.map((update) => (
                <div key={update.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                    <Badge className={`p-1 ${updateTypeColors[update.updateType]}`}>
                      {updateTypeIcons[update.updateType]}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 space-y-2 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{update.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {update.updateType.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {getInitials(update.user.firstName, update.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {update.user.firstName} {update.user.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {update.user.role}
                      </Badge>
                    </div>
                    
                    {update.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {update.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}