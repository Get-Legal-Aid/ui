import { useParams, Link } from "react-router-dom";
import { useGetCaseById, usePickupCase } from "@/services/cases/cases.hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { ApiError } from "@/services/auth/auth.types";
import { CaseHeader } from "./case-header";
import { CaseTimeline } from "./case-timeline";
import { CaseSidebar } from "./case-sidebar";
import { CaseTimelineView } from "./case-timeline-view";


export function CaseDetailsView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: caseData, isLoading, error } = useGetCaseById(id || "");
  const { mutateAsync: pickupCase, isPending: isPickingUp } = usePickupCase();

  // Check if user can pickup case
  const canPickupCase =
    user &&
    user.role === "LAWYER" &&
    caseData &&
    (caseData.status === "OPEN" || caseData.status === "UNDER_REVIEW") &&
    !caseData.assignedToId;

  // Check if user can manage case (lawyer who picked up the case or admin)
  const canManageCase =
    user &&
    caseData &&
    (user.role === "ADMIN" ||
      (caseData.assignedToId === user.id && user.role === "LAWYER"));


  // Check if user is a lawyer
  const isLawyer = user?.role === "LAWYER";

  const handlePickup = async () => {
    if (!caseData) return;

    try {
      await pickupCase(caseData.id);
      toast.success("Case Picked Up!", {
        description: "You've successfully claimed this case. 10 points awarded!",
      });
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Pickup Failed", {
          description:
            error.response.data.error.message ||
            "Failed to pick up case. It may have been claimed by someone else.",
        });
      } else {
        toast.error("Pickup Failed", {
          description: "Failed to pick up case. Please try again.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-96" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-serif mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The case you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link to="/cases">
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <PageBreadcrumb
          items={[
            { label: "Cases", href: "/cases" },
            { label: caseData.title, isCurrentPage: true },
          ]}
        />

        {/* Primary Action Buttons */}
        <div className="flex gap-3">
          {/* Student Research Link - Available for all users */}
          <Button asChild variant={"secondary"}>
            <Link to={`/cases/${caseData.id}/reviews`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Student Research
            </Link>
          </Button>

          {/* Case Notes Link - Only for lawyers who can manage the case */}
          {canManageCase && (
            <Button asChild variant={"secondary"}>
              <Link to={`/cases/${caseData.id}/notes`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Case Notes
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <CaseHeader
        caseData={caseData}
        canPickupCase={!!canPickupCase}
        canManageCase={!!canManageCase}
        isPickingUp={isPickingUp}
        onPickup={handlePickup}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Case Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {caseData.description}
              </p>
            </div>
          </div>


          {/* Enhanced Timeline - Only for lawyers and admins */}
          {(isLawyer || user?.role === "ADMIN") && (
            <CaseTimelineView caseId={caseData.id} canManage={!!canManageCase} />
          )}

          {/* Original Timeline (keeping for compatibility) */}
          <CaseTimeline caseData={caseData} />
        </div>

        {/* Right Column - Sidebar */}
        <CaseSidebar caseData={caseData} />
      </div>
    </div>
  );
}
