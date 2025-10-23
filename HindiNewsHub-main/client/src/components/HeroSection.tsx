import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "wouter";

interface HeroSectionProps {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  readTime: number;
  timeAgo: string;
  slug: string;
}

export function HeroSection({
  title,
  category,
  categorySlug,
  image,
  readTime,
  timeAgo,
  slug,
}: HeroSectionProps) {
  return (
    <Link href={`/article/${slug}`}>
      <a className="block relative group overflow-hidden rounded-lg" data-testid={`link-hero-${slug}`}>
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-primary text-primary-foreground">
                {category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Clock className="h-4 w-4" />
                <span>{readTime} मिनट</span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight" data-testid="text-hero-title">
              {title}
            </h2>
          </div>
        </div>
      </a>
    </Link>
  );
}
