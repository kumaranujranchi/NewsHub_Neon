import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertArticleSchema } from "@shared/schema";

const isEditor: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const dbUser = await storage.getUser(user.sub);
  if (!dbUser || (dbUser.role !== "editor" && dbUser.role !== "admin")) {
    return res.status(403).json({ message: "Forbidden: Editor or Admin access required" });
  }
  
  (req as any).dbUser = dbUser;
  next();
};

const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const dbUser = await storage.getUser(user.sub);
  if (!dbUser || dbUser.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  (req as any).dbUser = dbUser;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/articles/search', async (req, res) => {
    try {
      const { q, category, region } = req.query;
      
      const searchQuery = typeof q === 'string' ? q.trim() : '';
      const searchCategory = typeof category === 'string' && category ? category.trim() : undefined;
      const searchRegion = typeof region === 'string' && region ? region.trim() : undefined;

      if (!searchQuery && !searchCategory && !searchRegion) {
        return res.status(400).json({ message: "At least one search parameter required" });
      }
      
      const allArticles = await storage.getArticles({
        status: 'published',
        category: searchCategory,
      });

      let results = allArticles;

      if (searchRegion) {
        const lowerRegion = searchRegion.toLowerCase();
        results = results.filter(article => 
          article.region && article.region.toLowerCase().includes(lowerRegion)
        );
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        results = results.filter(article => 
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(lowerQuery))
        );
      }

      res.json(results);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  app.get('/api/articles', async (req, res) => {
    try {
      const { category, region, status, authorId, featured, limit, offset } = req.query;
      const articles = await storage.getArticles({
        category: category as string,
        region: region as string,
        status: status as string,
        authorId: authorId as string,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/articles/:id', async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get('/api/articles/by-slug/:slug', async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/articles', isEditor, async (req: any, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle({
        ...validatedData,
        authorId: req.dbUser.id,
      });
      res.status(201).json(article);
    } catch (error: any) {
      console.error("Error creating article:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.patch('/api/articles/:id', isEditor, async (req: any, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      if (article.authorId !== req.dbUser.id && req.dbUser.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: You can only edit your own articles" });
      }
      
      const allowedFields = ['title', 'subtitle', 'slug', 'content', 'excerpt', 'category', 'region', 'imageUrl', 'status', 'featured', 'readTime', 'publishedAt'];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedArticle = await storage.updateArticle(req.params.id, updateData);
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete('/api/articles/:id', isAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteArticle(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.post('/api/articles/:id/views', async (req, res) => {
    try {
      await storage.incrementArticleViews(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing article views:", error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  app.get('/api/articles/:id/comments', async (req, res) => {
    try {
      const comments = await storage.getCommentsByArticle(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const { articleId, content, parentId } = req.body;
      
      if (!articleId || !content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: "Article ID and valid content are required" });
      }
      
      const comment = await storage.createComment({
        articleId,
        userId,
        content: content.trim(),
        parentId: parentId || null,
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.patch('/api/comments/:id', isEditor, async (req: any, res) => {
    try {
      const { content, status } = req.body;
      
      const updateData: any = {};
      if (content !== undefined && typeof content === 'string' && content.trim().length > 0) {
        updateData.content = content.trim();
      }
      if (status !== undefined && ['approved', 'pending', 'rejected'].includes(status)) {
        updateData.status = status;
      }
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updated = await storage.updateComment(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  app.delete('/api/comments/:id', isEditor, async (req, res) => {
    try {
      const deleted = await storage.deleteComment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  app.get('/api/articles/:id/reactions', async (req, res) => {
    try {
      const reactions = await storage.getReactionsByArticle(req.params.id);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  app.post('/api/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const { articleId, type } = req.body;
      
      const validTypes = ['like', 'love', 'fire'];
      if (!articleId || !type || !validTypes.includes(type)) {
        return res.status(400).json({ message: "Article ID and valid type (like, love, fire) are required" });
      }
      
      const reaction = await storage.toggleReaction(userId, articleId, type);
      res.json(reaction);
    } catch (error) {
      console.error("Error toggling reaction:", error);
      res.status(500).json({ message: "Failed to toggle reaction" });
    }
  });

  app.get('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.post('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const { articleId } = req.body;
      
      if (!articleId || typeof articleId !== 'string') {
        return res.status(400).json({ message: "Valid Article ID is required" });
      }
      
      const bookmark = await storage.toggleBookmark(userId, articleId);
      res.json(bookmark);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      res.status(500).json({ message: "Failed to toggle bookmark" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
