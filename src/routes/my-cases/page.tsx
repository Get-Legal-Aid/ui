import { MyAssignedCasesList } from "./components/my-assigned-cases-list";
import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";

export default function MyCasesPage() {
  const { user } = useAuth();

  // Only lawyers can access this page
  if (user?.role !== "LAWYER") {
    return <Navigate to="/cases" replace />;
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Cases", href: "/cases" },
          { label: "My Cases", isCurrentPage: true },
        ]}
      />
      
      <div>
        <h1 className="text-3xl mb-2 font-serif">My Cases</h1>
        <p className="text-muted-foreground">
          Manage your picked-up cases and track progress
        </p>
      </div>

      <MyAssignedCasesList />
    </div>
  );
}