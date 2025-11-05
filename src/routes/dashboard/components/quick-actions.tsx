import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Trophy } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Submit New Case",
      description: "Get legal help for your issue",
      icon: PlusCircle,
      href: "/submit-case",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      title: "Track Case",
      description: "Check status of your case",
      icon: Search,
      href: "/track-case",
      color: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
    },
    {
      title: "View Leaderboard",
      description: "See top performing lawyers",
      icon: Trophy,
      href: "/leaderboard",
      color: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
    },
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className={`h-auto p-4 justify-start flex-col items-start space-y-2 ${action.color}`}
              >
                <Link to={action.href}>
                  <Icon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-70">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}