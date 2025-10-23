import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BreakingNewsBannerProps {
  news: string;
}

export function BreakingNewsBanner({ news }: BreakingNewsBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Badge
          variant="outline"
          className="bg-destructive-foreground/20 text-destructive-foreground border-destructive-foreground/30 whitespace-nowrap"
        >
          ब्रेकिंग न्यूज़
        </Badge>
        <p className="text-sm md:text-base font-medium truncate" data-testid="text-breaking-news">
          {news}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 hover:bg-destructive-foreground/20"
        onClick={() => setVisible(false)}
        data-testid="button-close-breaking"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
