import { CasesList } from "./components/cases-list";
import { useAuth } from "@/contexts/auth-context";

export default function CasesPage() {
  const { user } = useAuth();

  const getPageTitle = () => {
    if (user?.role === "STUDENT") {
      return {
        title: "All Cases",
        description: "Browse all legal aid cases across different statuses and practice areas"
      };
    }
    if (user?.role === "LAWYER") {
      return {
        title: "Cases",
        description: "Browse and pick up cases to work on"
      };
    }
    return {
      title: "Cases",
      description: "Legal aid cases overview"
    };
  };

  const { title, description } = getPageTitle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2 font-serif">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <CasesList />
    </div>
  );
}
