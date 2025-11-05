import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetLeaderboard, useGetUserRankInfo } from "@/services/leaderboard/leaderboard.hooks";
import { useAuth } from "@/contexts/auth-context";
import type { GetLeaderboardParams } from "@/services/leaderboard/leaderboard.types";
import { LeaderboardTable } from "./leaderboard-table";
import { LeaderboardFilters } from "./leaderboard-filters";
import { TopThreePodium } from "./top-three-podium";

export function LeaderboardView() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<GetLeaderboardParams>({
    page: 1,
    limit: 20,
    sortBy: "points",
    sortOrder: "desc",
    // Filter by role if user is student or lawyer
    role: user?.role === "STUDENT" || user?.role === "LAWYER" ? user.role : undefined,
  });

  const { data: leaderboardData, isLoading, error } = useGetLeaderboard(filters);
  const { data: userRankInfo } = useGetUserRankInfo();

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-serif mb-2">Failed to Load Leaderboard</h2>
        <p className="text-muted-foreground mb-6">
          Unable to fetch leaderboard data. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const { leaderboard: users, pagination } = leaderboardData;

  // Split users into top 3 and rest
  const topThree = users.filter(user => user.rank <= 3);

  // Get role-specific title and description
  const getLeaderboardInfo = () => {
    if (user?.role === "STUDENT") {
      return {
        title: "Student Leaderboard",
        description: "See how you rank among fellow law students"
      };
    }
    if (user?.role === "LAWYER") {
      return {
        title: "Lawyer Leaderboard", 
        description: "See how you rank among legal professionals"
      };
    }
    return {
      title: "Leaderboard",
      description: "See how you rank among legal professionals and students"
    };
  };

  const { title, description } = getLeaderboardInfo();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif mb-2">{title}</h1>
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      </div>

      {/* Top 3 Podium */}
      <TopThreePodium topThree={topThree} />

      {/* Current User Rank */}
      {userRankInfo && userRankInfo.currentUser.rank > 3 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Your Ranking</CardTitle>
            <CardDescription>
              You're currently ranked #{userRankInfo.currentUser.rank} with{" "}
              {userRankInfo.currentUser.points.toLocaleString()} points
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Rankings</h2>
          <div className="text-sm text-muted-foreground">
            Showing {((Number(pagination.page) - 1) * pagination.limit) + 1}-
            {Math.min(Number(pagination.page) * pagination.limit, pagination.total)} of{" "}
            {pagination.total} participants
          </div>
        </div>

        <LeaderboardTable users={users} currentUserId={user?.id} startFromRank={4} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Number(pagination.page) - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={Number(pagination.page) === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Number(pagination.page) + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}