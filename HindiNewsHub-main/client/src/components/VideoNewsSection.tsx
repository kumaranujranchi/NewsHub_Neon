import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Link } from "wouter";

interface VideoNews {
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  slug: string;
}

interface VideoNewsSectionProps {
  videos: VideoNews[];
}

export function VideoNewsSection({ videos }: VideoNewsSectionProps) {
  return (
    <Card className="p-6 h-full">
      <h3 className="text-xl font-bold mb-4">वीडियो समाचार</h3>
      <div className="space-y-4">
        {videos.map((video, index) => (
          <Link key={video.slug} href={`/article/${video.slug}`}>
            <a className="block" data-testid={`link-video-${video.slug}`}>
              <div className="flex gap-3 hover-elevate active-elevate-2 p-2 -m-2 rounded-md cursor-pointer">
                <div className="relative w-24 h-20 shrink-0">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                    <div className="p-2 bg-primary rounded-full">
                      <Play className="h-4 w-4 text-primary-foreground fill-current" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight" data-testid={`text-video-title-${video.slug}`}>
                    {video.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {video.category}
                  </Badge>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Card>
  );
}
