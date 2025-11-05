import { TrackCaseForm } from "./components/track-case-form";

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-2">
            Track Your Case
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your tracking code to view the status of your legal case
          </p>
        </div>

        <TrackCaseForm />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Don't have a tracking code?{" "}
            <a href="/submit-case" className="text-primary hover:underline font-medium">
              Submit a new case
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
