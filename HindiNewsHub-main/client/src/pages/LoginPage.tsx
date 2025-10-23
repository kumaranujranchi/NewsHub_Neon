import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">लॉगिन करें</CardTitle>
            <p className="text-muted-foreground">
              आपकासमाचार में आपका स्वागत है
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>समाचार पढ़ने, टिप्पणी करने और अपनी पसंदीदा खबरों को सेव करने के लिए लॉगिन करें।</p>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Replit के साथ लॉगिन करें
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              <p>लॉगिन करके आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}