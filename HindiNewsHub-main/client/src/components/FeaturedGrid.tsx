import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface FeaturedArticle {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  slug: string;
  featured?: boolean;
}

interface FeaturedGridProps {
  articles: FeaturedArticle[];
  title: string;
}

export function FeaturedGrid({ articles, title }: FeaturedGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article, index) => (
          <Link key={article.slug} href={`/article/${article.slug}`}>
            <a
              className={`block ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              data-testid={`link-featured-${article.slug}`}
            >
              <Card className="overflow-hidden h-full hover-elevate active-elevate-2 transition-shadow cursor-pointer">
                <div className={`relative ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 text-xs">
                      {article.category}
                    </Badge>
                    <h3
                      className={`font-bold text-white line-clamp-2 leading-tight ${index === 0 ? "text-xl md:text-2xl" : "text-sm"}`}
                      data-testid={`text-featured-title-${article.slug}`}
                    >
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
