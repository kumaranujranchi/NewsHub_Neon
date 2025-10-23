import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

interface TrendingArticle {
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  readTime: number;
  timeAgo: string;
  slug: string;
}

interface TrendingSectionProps {
  articles: TrendingArticle[];
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">ट्रेंडिंग</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            {...article}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}
