import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { Link } from "wouter";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  readTime: number;
  timeAgo: string;
  slug: string;
  variant?: "default" | "horizontal" | "compact";
}

export function ArticleCard({
  title,
  excerpt,
  category,
  categorySlug,
  image,
  author,
  readTime,
  timeAgo,
  slug,
  variant = "default",
}: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/article/${slug}`}>
        <a className="block" data-testid={`link-article-${slug}`}>
          <Card className="p-4 hover-elevate active-elevate-2 transition-shadow cursor-pointer">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <h3 className="font-semibold line-clamp-2 leading-tight" data-testid={`text-title-${slug}`}>
              {title}
            </h3>
          </Card>
        </a>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/article/${slug}`}>
        <a className="block" data-testid={`link-article-${slug}`}>
          <Card className="hover-elevate active-elevate-2 transition-shadow cursor-pointer overflow-hidden">
            <div className="flex gap-4 p-4">
              <img
                src={image}
                alt={title}
                className="w-24 h-24 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {category}
                </Badge>
                <h3 className="font-semibold mb-2 line-clamp-2 leading-tight" data-testid={`text-title-${slug}`}>
                  {title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{readTime} मिनट</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/article/${slug}`}>
      <a className="block" data-testid={`link-article-${slug}`}>
        <Card className="overflow-hidden hover-elevate active-elevate-2 transition-shadow cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight" data-testid={`text-title-${slug}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readTime} मिनट</span>
              </div>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}
