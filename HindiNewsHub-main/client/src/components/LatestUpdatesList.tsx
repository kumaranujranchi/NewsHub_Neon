import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "wouter";

interface LatestUpdate {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  timeAgo: string;
  slug: string;
}

interface LatestUpdatesListProps {
  updates: LatestUpdate[];
  title: string;
}

export function LatestUpdatesList({ updates, title }: LatestUpdatesListProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {updates.map((update) => (
          <Link key={update.slug} href={`/article/${update.slug}`}>
            <a className="block" data-testid={`link-update-${update.slug}`}>
              <div className="flex gap-3 hover-elevate active-elevate-2 p-2 -m-2 rounded-md cursor-pointer">
                <img
                  src={update.image}
                  alt={update.title}
                  className="w-20 h-20 object-cover rounded-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight" data-testid={`text-update-title-${update.slug}`}>
                    {update.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {update.category}
                    </Badge>
                    <Clock className="h-3 w-3" />
                    <span>{update.timeAgo}</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Card>
  );
}
