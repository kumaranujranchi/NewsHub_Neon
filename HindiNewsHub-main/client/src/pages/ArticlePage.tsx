import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArticleCard } from "@/components/ArticleCard";
import {
  Clock,
  Share2,
  Bookmark,
  ThumbsUp,
  Heart,
  Flame,
  MessageCircle,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Article, Comment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published' }],
  });

  const article = articles.find(a => a.slug === slug);

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: [`/api/articles/${article?.id}/comments`],
    enabled: !!article?.id,
  });

  const { data: reactions = [] } = useQuery({
    queryKey: [`/api/articles/${article?.id}/reactions`],
    enabled: !!article?.id,
  });

  const { data: relatedArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', { status: 'published', category: article?.category }],
    enabled: !!article?.category,
  });

  const reactionMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ articleId: article?.id, type }),
      });
      if (!response.ok) throw new Error('Failed to react');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${article?.id}/reactions`] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ articleId: article?.id }),
      });
      if (!response.ok) throw new Error('Failed to bookmark');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "बुकमार्क अपडेट किया गया" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ articleId: article?.id, content }),
      });
      if (!response.ok) throw new Error('Failed to comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${article?.id}/comments`] });
      setCommentText("");
      toast({ title: "टिप्पणी सबमिट की गई" });
    },
  });

  const handleReaction = (type: string) => {
    if (!user) {
      toast({ title: "कृपया लॉग इन करें", variant: "destructive" });
      return;
    }
    reactionMutation.mutate(type);
  };

  const handleBookmark = () => {
    if (!user) {
      toast({ title: "कृपया लॉग इन करें", variant: "destructive" });
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "कृपया लॉग इन करें", variant: "destructive" });
      return;
    }
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
  };

  const reactionCounts = {
    like: reactions.filter((r: any) => r.type === 'like').length,
    love: reactions.filter((r: any) => r.type === 'love').length,
    fire: reactions.filter((r: any) => r.type === 'fire').length,
  };

  const userReaction = user ? reactions.find((r: any) => r.userId === user.id)?.type : null;

  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">लेख नहीं मिला</h1>
          <p className="text-muted-foreground">यह लेख मौजूद नहीं है या हटा दिया गया है।</p>
        </div>
      </div>
    );
  }

  const mapArticleForComponent = (art: Article) => ({
    title: art.title,
    excerpt: art.excerpt || art.content.substring(0, 150) + "...",
    category: art.category,
    categorySlug: art.category,
    image: art.imageUrl || "",
    author: "संवाददाता",
    readTime: art.readTime,
    timeAgo: formatDistanceToNow(new Date(art.createdAt), { addSuffix: true, locale: hi }),
    slug: art.slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge data-testid="badge-category">{article.category}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} मिनट पढ़ने में</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: hi })}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" data-testid="text-article-title">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg text-muted-foreground mb-6">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>स</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">संवाददाता</p>
                <p className="text-sm text-muted-foreground">आपका समाचार</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.share?.({ title: article.title, url: window.location.href });
                }}
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                disabled={bookmarkMutation.isPending}
                data-testid="button-bookmark"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full rounded-lg mb-6"
            data-testid="img-article-cover"
          />
        )}

        <div className="prose prose-lg max-w-none mb-8" data-testid="article-content">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={userReaction === 'like' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('like')}
              className="gap-2"
              data-testid="button-reaction-like"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{reactionCounts.like}</span>
            </Button>
            <Button
              variant={userReaction === 'love' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('love')}
              className="gap-2"
              data-testid="button-reaction-love"
            >
              <Heart className="h-4 w-4" />
              <span>{reactionCounts.love}</span>
            </Button>
            <Button
              variant={userReaction === 'fire' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('fire')}
              className="gap-2"
              data-testid="button-reaction-fire"
            >
              <Flame className="h-4 w-4" />
              <span>{reactionCounts.fire}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length} टिप्पणियाँ</span>
          </div>
        </div>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-bold mb-6">टिप्पणियाँ</h2>
          
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <Textarea
                placeholder="अपनी टिप्पणी लिखें..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-4"
                rows={4}
                data-testid="textarea-comment"
              />
              <Button
                type="submit"
                disabled={commentMutation.isPending || !commentText.trim()}
                className="gap-2"
                data-testid="button-submit-comment"
              >
                <Send className="h-4 w-4" />
                टिप्पणी सबमिट करें
              </Button>
            </form>
          ) : (
            <Card className="p-6 mb-8 text-center">
              <p className="text-muted-foreground">
                टिप्पणी करने के लिए कृपया लॉग इन करें
              </p>
            </Card>
          )}

          <div className="space-y-6" data-testid="comments-list">
            {comments.filter(c => c.status === 'approved').map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>य</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="font-semibold">यूज़र</p>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: hi })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}

            {comments.filter(c => c.status === 'approved').length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                अभी तक कोई टिप्पणी नहीं है
              </p>
            )}
          </div>
        </section>
      </article>

      {relatedArticles.filter(a => a.id !== article.id).length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">संबंधित लेख</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles
              .filter(a => a.id !== article.id)
              .slice(0, 2)
              .map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} {...mapArticleForComponent(relatedArticle)} />
              ))}
          </div>
        </section>
      )}

      <footer className="bg-muted mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 आपका समाचार। सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}
