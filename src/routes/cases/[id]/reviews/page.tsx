import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, BookOpen, User, Edit, Plus } from "lucide-react";
import { useGetCaseReview, useGetCaseById } from "@/services/cases/cases.hooks";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { CreateReviewForm } from "./components/create-review-form";
import { SuggestLawyerForm } from "./components/suggest-lawyer-form";
import { useState } from "react";

export default function CaseReviewsPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  
  const { data: review, isLoading } = useGetCaseReview(caseId!);
  const { data: caseData } = useGetCaseById(caseId!);
  const isStudent = user?.role === "STUDENT";

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!caseId) {
    return <div>Case not found</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/cases/${caseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Cases", href: "/cases" },
            { label: caseData?.title || "Case", href: `/cases/${caseId}` },
            { label: "Student Research", href: `/cases/${caseId}/reviews` },
            { label: review ? "Update Review" : "Add Review", isCurrentPage: true },
          ]}
        />
        
        <CreateReviewForm 
          caseId={caseId} 
          existingReview={review || undefined}
          onSuccess={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  if (showSuggestForm) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Cases", href: "/cases" },
            { label: caseData?.title || "Case", href: `/cases/${caseId}` },
            { label: "Student Research", href: `/cases/${caseId}/reviews` },
            { label: "Suggest Lawyer", isCurrentPage: true },
          ]}
        />
        
        <SuggestLawyerForm 
          caseId={caseId}
          onSuccess={() => setShowSuggestForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageBreadcrumb
            items={[
              { label: "Cases", href: "/cases" },
              { label: caseData?.title || "Case", href: `/cases/${caseId}` },
              { label: "Student Research", isCurrentPage: true },
            ]}
          />
          <div className="mt-2">
            <h1 className="text-2xl font-bold">Student Research</h1>
            <p className="text-muted-foreground">Preliminary research findings and practice area analysis</p>
          </div>
        </div>

        {isStudent && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSuggestForm(true)}>
              <User className="h-4 w-4 mr-2" />
              Suggest Lawyer
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              {review ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Review
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Review Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Research Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!review ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No student research available yet</h3>
              {isStudent ? (
                <p>Be the first to provide preliminary research for this case.</p>
              ) : (
                <p>A student will provide preliminary research for this case.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(review.reviewedBy.firstName, review.reviewedBy.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {review.reviewedBy.firstName} {review.reviewedBy.lastName}
                    </span>
                    <Badge variant="outline">
                      {review.reviewedBy.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reviewed {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    {review.createdAt !== review.updatedAt && (
                      <span> • Updated {formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true })}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Research Findings */}
              <div className="space-y-3">
                <h4 className="font-medium">Research Findings</h4>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                    {review.findings}
                  </div>
                </div>
              </div>
              
              {/* Practice Area Suggestion */}
              {review.suggestedPracticeArea && (
                <div className="space-y-3">
                  <h4 className="font-medium">Suggested Practice Area</h4>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {review.suggestedPracticeArea}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}