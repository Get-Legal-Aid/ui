import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Briefcase, GraduationCap } from "lucide-react";
import type { LeaderboardUser } from "@/services/leaderboard/leaderboard.types";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  startFromRank?: number;
}

export function LeaderboardTable({ users, currentUserId, startFromRank = 4 }: LeaderboardTableProps) {
  // Filter out top 3 if this is for the main table
  const tableUsers = startFromRank > 1 ? users.filter(user => user.rank >= startFromRank) : users;

  if (tableUsers.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">User</div>
        <div className="col-span-1">Cases</div>
        <div className="col-span-1 text-right">Points</div>
      </div>

      {/* Table Rows */}
      {tableUsers.map((user) => {
        const isCurrentUser = user.id === currentUserId;
        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        
        return (
          <div
            key={user.id}
            className={cn(
              "grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
              isCurrentUser && "bg-blue-50 border-blue-200"
            )}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center">
              <span className="text-lg font-bold text-gray-900">{user.rank}</span>
            </div>

            {/* User Info */}
            <div className="col-span-5 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  {isCurrentUser && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {user.role === "LAWYER" ? (
                    <Briefcase className="h-3 w-3" />
                  ) : (
                    <GraduationCap className="h-3 w-3" />
                  )}
                  <span className="capitalize">{user.role.toLowerCase()}</span>
                  {user.lawyerProfile?.practiceArea && (
                    <span>• {user.lawyerProfile.practiceArea}</span>
                  )}
                  {user.studentProfile?.schoolName && (
                    <span>• {user.studentProfile.schoolName}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cases Resolved */}
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-gray-600">
                {user.casesResolved || 0}
              </span>
            </div>

            {/* Points */}
            <div className="col-span-1 flex items-center justify-end">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-blue-600">{user.points.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}