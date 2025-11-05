import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useWebSocket } from "@/lib/websocket/websocket-context";
import { useGetCases } from "@/services/cases/cases.hooks";
import type { CasePriority, CaseStatus } from "@/services/cases/cases.types";
import { useQueryClient } from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Search, BookOpen, FileText, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "../../cases/components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResearchHubList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onCasePickedUp } = useWebSocket();
  
  // For research hub, focus on cases that need student analysis (OPEN and UNDER_REVIEW)
  const [status, setStatus] = useState<CaseStatus | "all">("OPEN");
  const [priority, setPriority] = useState<CasePriority | "all">("all");
  const [search, setSearch] = useState("");

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Server-side pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Server-side sorting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // Fetch data with server-side params (using debounced search)
  const { data, isLoading, error } = useGetCases({
    page: pagination.pageIndex + 1, // API uses 1-based pagination
    limit: pagination.pageSize,
    status: status === "all" ? undefined : status,
    priority: priority === "all" ? undefined : priority,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id as
      | "createdAt"
      | "updatedAt"
      | "priority"
      | undefined,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const pageCount = useMemo(
    () => (data ? data.pagination.totalPages : 0),
    [data]
  );

  const handleRowClick = (caseItem: NonNullable<typeof data>["cases"][0]) => {
    navigate(`/cases/${caseItem.id}`);
  };

  // Listen for real-time case pickup events
  useEffect(() => {
    const unsubscribe = onCasePickedUp(() => {
      // Invalidate cases query to refetch and update the list
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    });

    return unsubscribe;
  }, [onCasePickedUp, queryClient]);

  // Get quick stats for the research hub
  const getQuickStats = () => {
    if (!data) return null;
    
    const openCases = data.cases.filter(c => c.status === "OPEN").length;
    const underReviewCases = data.cases.filter(c => c.status === "UNDER_REVIEW").length;
    const urgentCases = data.cases.filter(c => c.priority === "URGENT").length;
    
    return { openCases, underReviewCases, urgentCases };
  };

  const stats = getQuickStats();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openCases}</div>
              <p className="text-xs text-muted-foreground">
                Cases awaiting research
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.underReviewCases}</div>
              <p className="text-xs text-muted-foreground">
                Cases being analyzed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgentCases}</div>
              <p className="text-xs text-muted-foreground">
                Need immediate attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Research Tips */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-900">
            💡 Research Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <ul className="space-y-1">
            <li>• Focus on <strong>OPEN</strong> cases that need initial analysis</li>
            <li>• Add preliminary research findings to help lawyers understand the case</li>
            <li>• Suggest appropriate practice areas based on case details</li>
            <li>• Recommend lawyers with relevant expertise</li>
          </ul>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Reset to first page when searching
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as CaseStatus | "all");
              // Reset to first page when filtering
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priority}
            onValueChange={(value) => {
              setPriority(value as CasePriority | "all");
              // Reset to first page when filtering
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load cases. Please try again.
          </p>
        </div>
      )}

      {/* Data Table with Server-Side Features */}
      <DataTable
        columns={columns}
        data={data?.cases ?? []}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
        totalRows={data?.pagination.total ?? 0}
        onRowClick={handleRowClick}
      />
    </div>
  );
}