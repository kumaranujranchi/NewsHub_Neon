import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface PopularPost {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  slug: string;
}

interface PopularPostsSectionProps {
  posts: PopularPost[];
}

export function PopularPostsSection({ posts }: PopularPostsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">लोकप्रिय पोस्ट</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/article/${post.slug}`}>
            <a className="block" data-testid={`link-popular-${post.slug}`}>
              <Card className="overflow-hidden hover-elevate active-elevate-2 transition-shadow cursor-pointer">
                <div className="relative aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 text-xs">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 leading-tight" data-testid={`text-popular-title-${post.slug}`}>
                    {post.title}
                  </h3>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
