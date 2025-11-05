import { useGetCases } from "@/services/cases/cases.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CaseStatus, CasePriority } from "@/services/cases/cases.types";

const statusColors: Record<CaseStatus, string> = {
  OPEN: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-indigo-100 text-indigo-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<CasePriority, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function RecentCases() {
  const { data: casesData, isLoading } = useGetCases({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Cases
        </CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/cases">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {casesData?.cases.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No cases submitted yet
          </p>
        ) : (
          <div className="space-y-4">
            {casesData?.cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/cases/${caseItem.id}`}
                    className="font-medium text-sm hover:underline line-clamp-1"
                  >
                    {caseItem.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(caseItem.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className={statusColors[caseItem.status]}
                    >
                      {caseItem.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={priorityColors[caseItem.priority]}
                    >
                      {caseItem.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}