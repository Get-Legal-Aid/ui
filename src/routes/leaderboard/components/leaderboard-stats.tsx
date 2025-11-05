import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Trophy, Star, TrendingUp } from "lucide-react";
import type { LeaderboardStats } from "@/services/leaderboard/leaderboard.types";

interface LeaderboardStatsProps {
  stats: LeaderboardStats;
}

export function LeaderboardStatsCards({ stats }: LeaderboardStatsProps) {
  const topPerformerInitials = stats.topPerformer 
    ? `${stats.topPerformer.firstName[0]}${stats.topPerformer.lastName[0]}`.toUpperCase()
    : "";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {stats.totalLawyers} lawyers
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.totalStudents} students
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Points */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Points</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(stats.averagePoints).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all participants
          </p>
        </CardContent>
      </Card>

      {/* Top Performer */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          {stats.topPerformer ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold">
                  {topPerformerInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">
                  {stats.topPerformer.firstName} {stats.topPerformer.lastName}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs capitalize">
                    {stats.topPerformer.role.toLowerCase()}
                  </Badge>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium">{stats.topPerformer.points.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}