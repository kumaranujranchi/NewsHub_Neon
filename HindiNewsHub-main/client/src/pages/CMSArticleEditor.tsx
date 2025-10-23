import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Save, Upload } from "lucide-react";
import { insertArticleSchema, type InsertArticle, type Article } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const articleFormSchema = insertArticleSchema.extend({
  publishedAt: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

export default function CMSArticleEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);

  const isNewArticle = id === "new";

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
    enabled: !isNewArticle && !!id,
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      excerpt: "",
      category: "राष्ट्रीय",
      region: "",
      status: "draft",
      featured: false,
      imageUrl: "",
      readTime: 5,
    },
  });

  useEffect(() => {
    if (article && !isNewArticle) {
      form.reset({
        title: article.title,
        subtitle: article.subtitle || "",
        content: article.content,
        excerpt: article.excerpt || "",
        category: article.category,
        region: article.region || "",
        status: article.status,
        featured: article.featured,
        imageUrl: article.imageUrl || "",
        readTime: article.readTime,
        slug: article.slug,
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [article, isNewArticle, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "लेख सफलतापूर्वक बनाया गया" });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      setLocation("/cms");
    },
    onError: () => {
      toast({ title: "लेख बनाने में त्रुटि", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertArticle>) => {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "लेख सफलतापूर्वक अपडेट किया गया" });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({ title: "लेख अपडेट करने में त्रुटि", variant: "destructive" });
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    if (!user) return;

    const wordCount = data.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    if (isNewArticle) {
      const articleData: InsertArticle = {
        ...data,
        authorId: user.id,
        readTime,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0900-\u097F-]/g, ''),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.status === 'published' ? new Date() : undefined),
      };
      await createMutation.mutateAsync(articleData);
    } else {
      const updateData = {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        region: data.region,
        status: data.status,
        featured: data.featured,
        imageUrl: data.imageUrl,
        readTime,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0900-\u097F-]/g, ''),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.status === 'published' ? new Date() : undefined),
      };
      await updateMutation.mutateAsync(updateData);
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
              आपके पास इस पृष्ठ तक पहुँचने की अनुमति नहीं है।
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !isNewArticle) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/cms")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">
                {isNewArticle ? "नया लेख" : "लेख संपादित करें"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {form.watch("status") === "draft" ? "ड्राफ्ट" : 
                 form.watch("status") === "scheduled" ? "अनुसूचित" :
                 "प्रकाशित"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewMode(!previewMode)}
              data-testid="button-preview-toggle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gap-2"
              data-testid="button-save"
            >
              <Save className="h-4 w-4" />
              {isNewArticle ? "प्रकाशित करें" : "सहेजें"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {previewMode ? (
              <Card>
                <CardContent className="pt-6 prose prose-lg max-w-none">
                  <h1>{form.watch("title")}</h1>
                  {form.watch("subtitle") && (
                    <p className="text-xl text-muted-foreground">{form.watch("subtitle")}</p>
                  )}
                  {form.watch("imageUrl") && (
                    <img src={form.watch("imageUrl") || ""} alt={form.watch("title")} className="w-full rounded-lg" />
                  )}
                  <div className="whitespace-pre-wrap">{form.watch("content")}</div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>लेख विवरण</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">शीर्षक *</Label>
                      <Input
                        id="title"
                        {...form.register("title")}
                        placeholder="लेख का शीर्षक दर्ज करें..."
                        data-testid="input-title"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subtitle">उपशीर्षक</Label>
                      <Input
                        id="subtitle"
                        {...form.register("subtitle")}
                        placeholder="उपशीर्षक (वैकल्पिक)"
                        data-testid="input-subtitle"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">सारांश</Label>
                      <Textarea
                        id="excerpt"
                        {...form.register("excerpt")}
                        placeholder="लेख का संक्षिप्त सारांश..."
                        rows={3}
                        data-testid="input-excerpt"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">सामग्री *</Label>
                      <Textarea
                        id="content"
                        {...form.register("content")}
                        placeholder="लेख की सामग्री यहाँ लिखें..."
                        rows={15}
                        className="font-hindi"
                        data-testid="input-content"
                      />
                      {form.formState.errors.content && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.content.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">चित्र URL</Label>
                      <Input
                        id="imageUrl"
                        {...form.register("imageUrl")}
                        placeholder="https://example.com/image.jpg"
                        data-testid="input-image-url"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>प्रकाशन सेटिंग्स</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">स्थिति</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) => form.setValue("status", value as any)}
                  >
                    <SelectTrigger id="status" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">ड्राफ्ट</SelectItem>
                      <SelectItem value="scheduled">अनुसूचित</SelectItem>
                      <SelectItem value="published">प्रकाशित</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">श्रेणी *</Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="राष्ट्रीय">राष्ट्रीय</SelectItem>
                      <SelectItem value="राज्य">राज्य</SelectItem>
                      <SelectItem value="मनोरंजन">मनोरंजन</SelectItem>
                      <SelectItem value="व्यापार">व्यापार</SelectItem>
                      <SelectItem value="तकनीक">तकनीक</SelectItem>
                      <SelectItem value="खेल">खेल</SelectItem>
                      <SelectItem value="पोलिटिक्स">पोलिटिक्स</SelectItem>
                      <SelectItem value="स्टार्टअप">स्टार्टअप</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region">क्षेत्र</Label>
                  <Input
                    id="region"
                    {...form.register("region")}
                    placeholder="उदा: दिल्ली, मुंबई"
                    data-testid="input-region"
                  />
                </div>

                {form.watch("status") === "scheduled" && (
                  <div>
                    <Label htmlFor="publishedAt">प्रकाशन तिथि</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      {...form.register("publishedAt")}
                      data-testid="input-published-at"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">फीचर्ड लेख</Label>
                  <Switch
                    id="featured"
                    checked={form.watch("featured")}
                    onCheckedChange={(checked) => form.setValue("featured", checked)}
                    data-testid="switch-featured"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    {...form.register("slug")}
                    placeholder="article-url-slug"
                    data-testid="input-slug"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
