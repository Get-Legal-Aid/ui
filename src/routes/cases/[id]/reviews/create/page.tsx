import { CreateReviewForm } from "../components/create-review-form";
import { useAuth } from "@/contexts/auth-context";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateCaseReviewPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only students can create reviews
  if (user?.role !== "STUDENT") {
    return <Navigate to={`/cases/${caseId}`} replace />;
  }

  if (!caseId) {
    return <Navigate to="/cases" replace />;
  }

  const handleSuccess = () => {
    navigate(`/cases/${caseId}/reviews`);
  };

  const handleBack = () => {
    navigate(`/cases/${caseId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif">Add Case Review</h1>
          <p className="text-muted-foreground">
            Provide your research findings and recommendations for this case
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <CreateReviewForm caseId={caseId} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}