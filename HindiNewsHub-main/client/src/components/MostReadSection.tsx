import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface MostReadArticle {
  title: string;
  category: string;
  categorySlug: string;
  timeAgo: string;
  slug: string;
}

interface MostReadSectionProps {
  articles: MostReadArticle[];
}

export function MostReadSection({ articles }: MostReadSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">सबसे ज़्यादा पढ़े गए</h3>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link key={article.slug} href={`/article/${article.slug}`}>
            <a className="block" data-testid={`link-mostread-${article.slug}`}>
              <div className="flex gap-3 hover-elevate active-elevate-2 p-2 -m-2 rounded-md cursor-pointer">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground font-bold rounded-md shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight" data-testid={`text-mostread-title-${article.slug}`}>
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {article.category}
                    </Badge>
                    <span>{article.timeAgo}</span>
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
