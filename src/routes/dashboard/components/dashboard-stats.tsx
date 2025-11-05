import { useGetCases } from "@/services/cases/cases.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Trophy, Clock } from "lucide-react";

export function DashboardStats() {
  const { data: casesData } = useGetCases({ limit: 1000 });

  const totalCases = casesData?.pagination.total || 0;
  const resolvedCases = casesData?.cases.filter(c => c.status === "RESOLVED").length || 0;
  const pendingCases = casesData?.cases.filter(c => c.status === "OPEN" || c.status === "ASSIGNED").length || 0;

  const stats = [
    {
      title: "Total Cases",
      value: totalCases,
      icon: Scale,
      description: "All submitted cases",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Resolved Cases",
      value: resolvedCases,
      icon: Trophy,
      description: "Successfully resolved",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Cases",
      value: pendingCases,
      icon: Clock,
      description: "Awaiting resolution",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}