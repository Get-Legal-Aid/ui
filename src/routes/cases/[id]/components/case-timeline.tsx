import { User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Case } from "@/services/cases/cases.types";

interface CaseTimelineProps {
  caseData: Case;
}

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  description?: string;
}

function TimelineItem({ icon, title, date, description }: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(date), "MMMM d, yyyy 'at' h:mm a")}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}

export function CaseTimeline({ caseData }: CaseTimelineProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Timeline</h2>
      <div className="space-y-4">
        <TimelineItem
          icon={<Calendar className="h-4 w-4" />}
          title="Case Created"
          date={caseData.createdAt}
        />
        {caseData.assignedAt && (
          <TimelineItem
            icon={<User className="h-4 w-4" />}
            title="Case Assigned"
            date={caseData.assignedAt}
          />
        )}
        {caseData.resolvedAt && (
          <TimelineItem
            icon={<Clock className="h-4 w-4" />}
            title="Case Resolved"
            date={caseData.resolvedAt}
            description={caseData.resolutionNotes}
          />
        )}
        {caseData.closedAt && (
          <TimelineItem
            icon={<Clock className="h-4 w-4" />}
            title="Case Closed"
            date={caseData.closedAt}
            description={caseData.closureNotes}
          />
        )}
      </div>
    </div>
  );
}