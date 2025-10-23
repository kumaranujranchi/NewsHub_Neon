import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";

import { categories as allCategories } from "@shared/categories";

const categories = [
  { name: "सभी श्रेणियाँ", dbValue: "" },
  ...allCategories.map(cat => ({ name: cat.name, dbValue: cat.dbValue })),
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [regionQuery, setRegionQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("");

  const dbCategory = selectedCategory === "all" || !selectedCategory ? null : selectedCategory;
  const dbRegion = activeRegion || null;

  const { data: results = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/search', { q: activeQuery, category: dbCategory, region: dbRegion }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeQuery) params.append('q', activeQuery);
      if (dbCategory) params.append('category', dbCategory);
      if (dbRegion) params.append('region', dbRegion);
      
      const url = `/api/articles/search${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: !!(activeQuery || dbCategory || dbRegion),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    setActiveRegion(regionQuery.trim());
  };

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
        <h1 className="text-3xl font-bold mb-6">समाचार खोजें</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="समाचार खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  data-testid="input-search"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button type="submit" data-testid="button-search-submit">
                खोजें
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64" data-testid="select-category">
                  <SelectValue placeholder="श्रेणी चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.dbValue || "all"} value={cat.dbValue || "all"} data-testid={`option-category-${cat.dbValue || "all"}`}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="क्षेत्र (उदा: दिल्ली, मुंबई)"
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                data-testid="input-region"
              />
            </div>
          </div>
        </form>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {activeQuery ? "कोई परिणाम नहीं मिला" : "खोज शुरू करने के लिए ऊपर टाइप करें"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {results.length} परिणाम मिले
                {activeQuery && ` "${activeQuery}" के लिए`}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="search-results">
              {results.map((article) => (
                <ArticleCard key={article.id} {...mapArticleForComponent(article)} />
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="bg-muted mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 आपका समाचार। सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}
