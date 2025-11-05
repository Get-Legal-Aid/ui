import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trophy, Medal, Award, Briefcase, GraduationCap } from "lucide-react";
import type { LeaderboardUser } from "@/services/leaderboard/leaderboard.types";
import { cn } from "@/lib/utils";

interface TopThreePodiumProps {
  topThree: LeaderboardUser[];
}

const getPodiumPosition = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        icon: <Trophy className="h-6 w-6 text-yellow-500" />,
        badgeNumber: "1",
        bgColor: "bg-gradient-to-b from-yellow-50 to-yellow-100",
        borderColor: "border-yellow-200",
        order: "order-2", // Center position
        size: "scale-110",
      };
    case 2:
      return {
        icon: <Medal className="h-5 w-5 text-gray-400" />,
        badgeNumber: "2", 
        bgColor: "bg-gradient-to-b from-gray-50 to-gray-100",
        borderColor: "border-gray-200",
        order: "order-1", // Left position
        size: "scale-100",
      };
    case 3:
      return {
        icon: <Award className="h-5 w-5 text-amber-600" />,
        badgeNumber: "3",
        bgColor: "bg-gradient-to-b from-amber-50 to-amber-100", 
        borderColor: "border-amber-200",
        order: "order-3", // Right position
        size: "scale-100",
      };
    default:
      return null;
  }
};

export function TopThreePodium({ topThree }: TopThreePodiumProps) {
  if (topThree.length === 0) return null;

  return (
    <div className="flex justify-center items-end gap-4 mb-8">
      {topThree.map((user) => {
        const position = getPodiumPosition(user.rank);
        if (!position) return null;

        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

        return (
          <Card
            key={user.id}
            className={cn(
              "relative transition-all duration-200 hover:shadow-lg",
              position.bgColor,
              position.borderColor,
              position.order,
              position.size,
              "w-64"
            )}
          >
            {/* Rank Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-current">
                {position.icon}
              </div>
            </div>

            <CardContent className="pt-8 pb-6 text-center">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-200">
                    {position.badgeNumber}
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3 className="font-bold text-lg mb-1">
                {user.firstName} {user.lastName}
              </h3>

              {/* Role & Info */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {user.role === "LAWYER" ? (
                    <Briefcase className="h-3 w-3" />
                  ) : (
                    <GraduationCap className="h-3 w-3" />
                  )}
                  <span className="text-sm text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <p className="text-xs text-muted-foreground mb-4 truncate">
                {user.lawyerProfile?.practiceArea || user.studentProfile?.schoolName || "Legal Professional"}
              </p>

              {/* Points */}
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{user.points.toLocaleString()}</span>
              </div>

              {/* Stats */}
              <div className="text-xs text-muted-foreground space-y-1">
                {user.casesResolved !== undefined && (
                  <p>{user.casesResolved} cases resolved</p>
                )}
                {user.lawyerProfile?.operatingRegion && (
                  <p className="truncate">{user.lawyerProfile.operatingRegion}</p>
                )}
              </div>

              {/* Mock Achievement Badges */}
              <div className="flex justify-center gap-1 mt-3 flex-wrap">
                {user.rank === 1 && (
                  <>
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                      🏆 Top Lawyer
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      🎯 Case Master
                    </Badge>
                  </>
                )}
                {user.rank === 2 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    ⚡ Rising Star
                  </Badge>
                )}
                {user.rank === 3 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    📚 Law Scholar
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}