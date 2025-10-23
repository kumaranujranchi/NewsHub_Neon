import { Header } from "@/components/Header";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";
import { HeroSection } from "@/components/HeroSection";
import { CategoryTile } from "@/components/CategoryTile";
import { TrendingSection } from "@/components/TrendingSection";
import { MostReadSection } from "@/components/MostReadSection";
import { ArticleCard } from "@/components/ArticleCard";
import { PopularPostsSection } from "@/components/PopularPostsSection";
import { LatestUpdatesList } from "@/components/LatestUpdatesList";
import { VideoNewsSection } from "@/components/VideoNewsSection";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";
import {
  Newspaper,
  MapPin,
  Film,
  Briefcase,
  Smartphone,
  Trophy,
  Landmark,
  Rocket,
} from "lucide-react";

const categories = [
  { name: "राष्ट्रीय", slug: "राष्ट्रीय", icon: Newspaper },
  { name: "राज्य", slug: "राज्य", icon: MapPin },
  { name: "मनोरंजन", slug: "मनोरंजन", icon: Film },
  { name: "व्यापार", slug: "व्यापार", icon: Briefcase },
  { name: "तकनीक", slug: "तकनीक", icon: Smartphone },
  { name: "खेल", slug: "खेल", icon: Trophy },
  { name: "पोलिटिक्स", slug: "पोलिटिक्स", icon: Landmark },
  { name: "स्टार्टअप", slug: "स्टार्टअप", icon: Rocket },
];

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { data: allArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published' }],
  });

  const { data: featuredArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published', featured: true }],
  });

  const trendingArticles = allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const latestArticles = allArticles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const mostReadArticles = allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const popularPosts = allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const latestUpdates = allArticles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const videoNewsArticles = allArticles
    .filter(a => a.category === "तकनीक" || a.category === "स्टार्टअप")
    .slice(0, 3);

  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: allArticles.filter(a => a.category === cat.slug).length,
  }));

  const uniqueRegions = Array.from(new Set(allArticles.map(a => a.region).filter(Boolean)));
  const regionLinks = uniqueRegions.map(region => ({
    title: region as string,
    slug: region as string,
    count: allArticles.filter(a => a.region === region).length,
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", newsletterEmail);
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsBanner />

      <main className="container mx-auto px-4 py-8">
        {featuredArticles.length > 0 && (
          <HeroSection articles={featuredArticles.slice(0, 5).map(mapArticleForComponent)} />
        )}

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary pb-2 inline-block">
            श्रेणियाँ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryCounts.map((category) => (
              <CategoryTile key={category.slug} {...category} />
            ))}
          </div>
        </section>

        {trendingArticles.length > 0 && (
          <section className="my-12">
            <TrendingSection articles={trendingArticles.map(mapArticleForComponent)} />
          </section>
        )}

        <div className="grid lg:grid-cols-[1fr_350px] gap-8 my-12">
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold border-b-2 border-primary pb-2 inline-block">
                  ताज़ा खबरें
                </h2>
                <Button variant="link" data-testid="link-view-all">
                  सभी देखें →
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {latestArticles.slice(0, 4).map((article, index) => (
                  <ArticleCard key={article.id || index} {...mapArticleForComponent(article)} />
                ))}
              </div>
            </section>

            {latestUpdates.length > 0 && (
              <section>
                <LatestUpdatesList updates={latestUpdates.map(mapArticleForComponent)} />
              </section>
            )}
          </div>

          <aside className="space-y-8">
            {mostReadArticles.length > 0 && (
              <MostReadSection articles={mostReadArticles.map(article => ({
                title: article.title,
                category: article.category,
                categorySlug: article.category,
                timeAgo: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: hi }),
                slug: article.slug,
              }))} />
            )}

            {popularPosts.length > 0 && (
              <PopularPostsSection posts={popularPosts.map(mapArticleForComponent)} />
            )}
          </aside>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 my-12">
          {videoNewsArticles.length > 0 && (
            <section>
              <VideoNewsSection videos={videoNewsArticles.map(article => ({
                ...mapArticleForComponent(article),
                views: article.views,
              }))} />
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary pb-2 inline-block">
              न्यूज़लेटर
            </h2>
            <div className="bg-card border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                रोज़ाना की ताज़ा खबरें सीधे अपने ईमेल पर पाएं
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="अपना ईमेल दर्ज करें"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" data-testid="button-newsletter-subscribe">
                  सब्सक्राइब
                </Button>
              </form>
            </div>
          </section>
        </div>

        {allArticles.length > 8 && (
          <section className="my-12">
            <FeaturedGrid articles={allArticles.slice(0, 8).map(mapArticleForComponent)} />
          </section>
        )}

        {regionLinks.length > 0 && (
          <section className="my-12">
            <QuickLinksSection links={regionLinks} />
          </section>
        )}
      </main>

      <footer className="bg-muted mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 आपका समाचार। सर्वाधिकार सुरक्षित।</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="/about" className="hover:text-foreground">
              हमारे बारे में
            </a>
            <a href="/contact" className="hover:text-foreground">
              संपर्क करें
            </a>
            <a href="/privacy" className="hover:text-foreground">
              गोपनीयता नीति
            </a>
            <a href="/terms" className="hover:text-foreground">
              नियम और शर्तें
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
