import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { GetLeaderboardParams } from "@/services/leaderboard/leaderboard.types";
import { useAuth } from "@/contexts/auth-context";

interface LeaderboardFiltersProps {
  filters: GetLeaderboardParams;
  onFiltersChange: (filters: GetLeaderboardParams) => void;
}

export function LeaderboardFilters({
  filters,
  onFiltersChange,
}: LeaderboardFiltersProps) {
  const { user } = useAuth();
  const updateFilter = (key: keyof GetLeaderboardParams, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
      page: 1, // Reset to first page when filters change
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
    });
  };

  // Only consider role as active filter for admins
  const hasActiveFilters = (user?.role === "ADMIN" && filters.role) || 
                          filters.timeframe || 
                          filters.region || 
                          filters.practiceArea;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Role Filter - Only show for admins */}
        {user?.role === "ADMIN" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => updateFilter("role", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LAWYER">Lawyers</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timeframe Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <Select
            value={filters.timeframe || "ALL_TIME"}
            onValueChange={(value) => updateFilter("timeframe", value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_TIME">All time</SelectItem>
              <SelectItem value="MONTHLY">This month</SelectItem>
              <SelectItem value="WEEKLY">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Sort By Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select
            value={filters.sortBy || "points"}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Points</SelectItem>
              {/* Show different options based on role */}
              {user?.role === "LAWYER" && (
                <>
                  <SelectItem value="casesResolved">Cases resolved</SelectItem>
                  <SelectItem value="casesAssigned">Cases handled</SelectItem>
                </>
              )}
              {user?.role === "STUDENT" && (
                <SelectItem value="casesResolved">Research completed</SelectItem>
              )}
              {user?.role === "ADMIN" && (
                <>
                  <SelectItem value="casesResolved">Cases resolved</SelectItem>
                  <SelectItem value="casesAssigned">Cases assigned</SelectItem>
                </>
              )}
              <SelectItem value="joinedAt">Join date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {user?.role === "ADMIN" && filters.role && (
            <Badge variant="secondary" className="gap-1">
              Role: {filters.role}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("role", undefined)}
              />
            </Badge>
          )}
          
          {filters.timeframe && filters.timeframe !== "ALL_TIME" && (
            <Badge variant="secondary" className="gap-1">
              {filters.timeframe === "MONTHLY" ? "This month" : "This week"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("timeframe", undefined)}
              />
            </Badge>
          )}
          

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}