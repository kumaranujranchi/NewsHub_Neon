import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface QuickLink {
  title: string;
  count: number;
  slug: string;
}

interface QuickLinksSectionProps {
  links: QuickLink[];
}

export function QuickLinksSection({ links }: QuickLinksSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">क्षेत्रीय समाचार</h3>
      <div className="space-y-2">
        {links.map((link) => (
          <Link key={link.slug} href={`/region/${link.slug}`}>
            <a
              className="flex items-center justify-between p-3 hover-elevate active-elevate-2 rounded-md cursor-pointer"
              data-testid={`link-region-${link.slug}`}
            >
              <div>
                <span className="font-semibold">{link.title}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({link.count} खबरें)
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </Link>
        ))}
      </div>
    </Card>
  );
}
