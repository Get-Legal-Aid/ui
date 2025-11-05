import { ProfileForm } from "./components/profile-form";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Settings", href: "/settings" },
          { label: "Profile", isCurrentPage: true },
        ]}
      />
      
      <div>
        <h1 className="text-3xl font-serif">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal and professional information
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
