import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Clock, Settings, Search, Eye, Trash2, Pencil } from "lucide-react";
import type { Article } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export default function CMSDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: user?.role === 'admin' ? ['/api/articles'] : ['/api/articles', { authorId: user?.id }],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "draft") return matchesSearch && article.status === "draft";
    if (activeTab === "scheduled") return matchesSearch && article.status === "scheduled";
    if (activeTab === "published") return matchesSearch && article.status === "published";
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("क्या आप वाकई इस लेख को हटाना चाहते हैं?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (!user || (user.role !== "editor" && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>अनधिकृत पहुँच</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              आपके पास इस पृष्ठ तक पहुँचने की अनुमति नहीं है। कृपया संपादक या व्यवस्थापक के रूप में लॉग इन करें।
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/10 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold">CMS डैशबोर्ड</h2>
          <p className="text-sm text-muted-foreground">संपादक पैनल</p>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("all")}
            data-testid="button-all-articles"
          >
            <FileText className="h-4 w-4" />
            सभी लेख
          </Button>
          <Button
            variant={activeTab === "draft" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("draft")}
            data-testid="button-drafts"
          >
            <FileText className="h-4 w-4" />
            ड्राफ्ट
          </Button>
          <Button
            variant={activeTab === "scheduled" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("scheduled")}
            data-testid="button-scheduled"
          >
            <Clock className="h-4 w-4" />
            अनुसूचित
          </Button>
          <Button
            variant={activeTab === "published" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("published")}
            data-testid="button-published"
          >
            <Eye className="h-4 w-4" />
            प्रकाशित
          </Button>
        </nav>

        <div className="mt-8 pt-8 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
            सेटिंग्स
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="लेख खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>
          <Button
            onClick={() => setLocation("/cms/article/new")}
            className="gap-2"
            data-testid="button-create-article"
          >
            <Plus className="h-4 w-4" />
            नया लेख
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "कोई लेख नहीं मिला" : "अभी तक कोई लेख नहीं है"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setLocation("/cms/article/new")}
                  className="mt-4 gap-2"
                  data-testid="button-create-first-article"
                >
                  <Plus className="h-4 w-4" />
                  पहला लेख बनाएं
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" data-testid="articles-list">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover-elevate">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CardTitle className="text-lg line-clamp-1">
                        {article.title}
                      </CardTitle>
                      <Badge variant={
                        article.status === "published" ? "default" :
                        article.status === "scheduled" ? "secondary" :
                        "outline"
                      } data-testid={`badge-status-${article.id}`}>
                        {article.status === "published" ? "प्रकाशित" :
                         article.status === "scheduled" ? "अनुसूचित" :
                         "ड्राफ्ट"}
                      </Badge>
                      {article.featured && (
                        <Badge variant="default" data-testid={`badge-featured-${article.id}`}>
                          फीचर्ड
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt || article.content.substring(0, 150)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span>{article.category}</span>
                      {article.region && <span>{article.region}</span>}
                      <span>{article.views} बार देखा गया</span>
                      <span>
                        {article.updatedAt ? 
                          formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true }) :
                          formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setLocation(`/article/${article.slug || article.id}`)}
                      data-testid={`button-preview-${article.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setLocation(`/cms/article/${article.id}`)}
                      data-testid={`button-edit-${article.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {user.role === "admin" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(article.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${article.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
