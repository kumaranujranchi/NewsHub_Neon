import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export function NewsletterCard() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <Card className="p-6 bg-primary text-primary-foreground h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary-foreground/20 rounded-lg shrink-0">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">न्यूज़लेटर सब्सक्राइब करें</h3>
        </div>
        <p className="text-sm text-primary-foreground/90 mb-4">
          ताज़ा खबरें सीधे अपने ईमेल पर पाएं
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
          <Input
            type="email"
            placeholder="अपना ईमेल दर्ज करें"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            data-testid="button-newsletter-submit"
          >
            सब्सक्राइब
          </Button>
        </form>
      </div>
    </Card>
  );
}
