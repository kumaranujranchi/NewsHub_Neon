import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface CategoryTileProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  count?: number;
}

export function CategoryTile({ name, slug, icon: Icon, count }: CategoryTileProps) {
  return (
    <Link href={`/category/${slug}`}>
      <a data-testid={`link-category-tile-${slug}`}>
        <Card className="p-4 hover-elevate active-elevate-2 transition-shadow cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-sm">{name}</h3>
            {count !== undefined && (
              <span className="text-xs text-muted-foreground">{count} खबरें</span>
            )}
          </div>
        </Card>
      </a>
    </Link>
  );
}
