import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, Copy, Mail, Search } from "lucide-react";

interface SuccessStepProps {
  trackingCode: string;
  onSubmitAnother: () => void;
}

export function SuccessStep({ trackingCode, onSubmitAnother }: SuccessStepProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode);
    toast.success("Tracking code copied to clipboard!");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-3xl font-serif font-normal">
          Case Submitted Successfully!
        </CardTitle>
        <CardDescription className="text-base">
          Your case has been received and will be reviewed by our legal team
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tracking Code Display */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Your Tracking Code
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-mono font-bold tracking-wider">
              {trackingCode}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="hover:bg-primary/10"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Save this code to track your case status
          </p>
        </div>

        {/* What Happens Next */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">What Happens Next?</h3>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium">Email Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email with your tracking code
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Search className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium">Case Review</p>
                <p className="text-sm text-muted-foreground">
                  A lawyer will review your case within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium">Assignment Notification</p>
                <p className="text-sm text-muted-foreground">
                  You'll be notified when a lawyer is assigned to your case
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button className="w-full" asChild>
            <a href={`/track?code=${trackingCode}`}>Track Your Case</a>
          </Button>
          <Button variant="outline" className="w-full" onClick={onSubmitAnother}>
            Submit Another Case
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
