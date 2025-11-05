import { ResearchHubList } from "./components/research-hub-list";
import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";

export default function ResearchHubPage() {
  const { user } = useAuth();

  // Only students can access the research hub
  if (user?.role !== "STUDENT") {
    return <Navigate to="/cases" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2 font-serif">Research Hub</h1>
        <p className="text-muted-foreground">
          Find cases that need preliminary research and analysis. Help identify case types and suggest appropriate lawyers.
        </p>
      </div>
      <ResearchHubList />
    </div>
  );
}