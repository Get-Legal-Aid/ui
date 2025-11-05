import { MultiStepForm } from "./components/multi-step-form";

export default function SubmitCasePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block px-6 py-3 bg-primary/10 rounded-2xl border-2 border-primary/20">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
              Get Legal Help
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Submit your legal case and connect with qualified lawyers ready to help
          </p>
        </div>

        <MultiStepForm />

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Already have a tracking code?{" "}
            <a href="/track" className="text-primary hover:underline font-medium">
              Track your case
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
