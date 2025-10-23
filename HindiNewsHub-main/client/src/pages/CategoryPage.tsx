import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { MostReadSection } from "@/components/MostReadSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getCategoryByUrlSlug } from "@shared/categories";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const urlSlug = params?.slug || "national";
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  const category = getCategoryByUrlSlug(urlSlug);
  const dbCategory = category?.dbValue || "राष्ट्रीय";
  const categoryName = category?.name || "राष्ट्रीय";

  const { data: allArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published', category: dbCategory }],
  });

  const { data: mostReadArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published' }],
  });
  
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = allArticles.slice(startIndex, endIndex);

  const mostRead = mostReadArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(article => ({
      title: article.title,
      category: article.category,
      categorySlug: article.category,
      timeAgo: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: hi }),
      slug: article.slug,
    }));

  const mapArticleForComponent = (article: Article) => ({
    title: article.title,
    excerpt: article.excerpt || article.content.substring(0, 150) + "...",
    category: article.category,
    categorySlug: article.category,
    image: article.imageUrl || "",
    author: "संवाददाता",
    readTime: article.readTime,
    timeAgo: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: hi }),
    slug: article.slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="text-lg px-4 py-2" data-testid="badge-category">
            {categoryName}
          </Badge>
          <p className="text-muted-foreground mt-2">
            {allArticles.length} लेख मिले
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <div>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : paginatedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  इस श्रेणी में कोई लेख नहीं मिला
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8" data-testid="articles-grid">
                  {paginatedArticles.map((article) => (
                    <ArticleCard key={article.id} {...mapArticleForComponent(article)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          data-testid={`button-page-${page}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside>
            {mostRead.length > 0 && <MostReadSection articles={mostRead} />}
          </aside>
        </div>
      </div>

      <footer className="bg-muted mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 आपका समाचार। सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}
