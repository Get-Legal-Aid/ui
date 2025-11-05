import { DashboardStats } from "./components/dashboard-stats";
import { RecentCases } from "./components/recent-cases";
import { QuickActions } from "./components/quick-actions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2 font-serif">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to GetLegalAid dashboard
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCases />
        <QuickActions />
      </div>
    </div>
  );
}
