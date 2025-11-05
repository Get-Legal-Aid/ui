import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            {/* Large 404 text */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-9xl font-serif font-bold text-primary/20">4</span>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                <div className="relative bg-primary/10 p-8 rounded-full border-2 border-primary/20">
                  <Search className="w-16 h-16 text-primary" />
                </div>
              </div>
              <span className="text-9xl font-serif font-bold text-primary/20">4</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's get
            you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={handleGoHome}
            className="gap-2"
            size="lg"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Button>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="gap-2"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <a
              href="/submit-case"
              className="text-primary hover:underline font-medium"
            >
              Submit a Case
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/track"
              className="text-primary hover:underline font-medium"
            >
              Track a Case
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
