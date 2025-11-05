import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/breadcrumb/page-breadcrumb";
import { User, Shield, Bell, Palette, HelpCircle, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const settingsOptions = [
    {
      title: "Profile",
      description: "Manage your personal and professional information",
      icon: User,
      href: "/settings/profile",
      available: true,
    },
    {
      title: "Security",
      description: "Password, two-factor authentication, and login settings",
      icon: Shield,
      href: "/settings/security",
      available: false, // Coming soon
    },
    {
      title: "Notifications",
      description: "Email notifications, alerts, and communication preferences",
      icon: Bell,
      href: "/settings/notifications",
      available: false, // Coming soon
    },
    {
      title: "Appearance",
      description: "Theme, layout, and display preferences",
      icon: Palette,
      href: "/settings/appearance",
      available: false, // Coming soon
    },
    {
      title: "Help & Support",
      description: "Get help, contact support, and view documentation",
      icon: HelpCircle,
      href: "/settings/help",
      available: false, // Coming soon
    },
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Settings", isCurrentPage: true },
        ]}
      />
      
      <div>
        <h1 className="text-3xl font-serif">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          
          if (option.available) {
            return (
              <Card key={option.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="w-full">
                    <Link to={option.href}>
                      Configure
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={option.title} className="opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-muted-foreground">{option.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border border-muted bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">Need Help?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              If you need assistance with your settings or have questions about your account, 
              please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}