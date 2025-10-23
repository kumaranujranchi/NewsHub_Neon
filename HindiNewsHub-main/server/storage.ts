import { db } from "./db";
import { eq, and, desc, sql, like, or, SQL } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type UpsertUser,
  type Article,
  type InsertArticle,
  type Comment,
  type InsertComment,
  type Reaction,
  type InsertReaction,
  type Bookmark,
  type InsertBookmark,
  users,
  articles,
  comments,
  reactions,
  bookmarks,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Article methods
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticles(filters?: {
    category?: string;
    region?: string;
    status?: string;
    authorId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  incrementArticleViews(id: string): Promise<void>;
  
  // Comment methods
  getCommentsByArticle(articleId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: string, updates: { content?: string; status?: string }): Promise<Comment | undefined>;
  deleteComment(id: string): Promise<boolean>;
  
  // Reaction methods
  getReactionsByArticle(articleId: string): Promise<Reaction[]>;
  getUserReactionForArticle(userId: string, articleId: string): Promise<Reaction | undefined>;
  toggleReaction(userId: string, articleId: string, type: string): Promise<Reaction | null>;
  
  // Bookmark methods
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  getUserBookmarkForArticle(userId: string, articleId: string): Promise<Bookmark | undefined>;
  toggleBookmark(userId: string, articleId: string): Promise<Bookmark | null>;
}

export class DBStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Article methods
  async getArticle(id: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async getArticles(filters?: {
    category?: string;
    region?: string;
    status?: string;
    authorId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    const conditions: SQL[] = [];
    
    if (filters?.category) {
      conditions.push(eq(articles.category, filters.category));
    }
    if (filters?.region) {
      conditions.push(eq(articles.region, filters.region));
    }
    if (filters?.status) {
      conditions.push(eq(articles.status, filters.status));
    }
    if (filters?.authorId) {
      conditions.push(eq(articles.authorId, filters.authorId));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(articles.featured, filters.featured));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const result = await db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(desc(articles.publishedAt))
      .limit(filters?.limit || 100)
      .offset(filters?.offset || 0);

    return result;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const result = await db
      .update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id)).returning();
    return result.length > 0;
  }

  async incrementArticleViews(id: string): Promise<void> {
    await db
      .update(articles)
      .set({ views: sql`${articles.views} + 1` })
      .where(eq(articles.id, id));
  }

  // Comment methods
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.articleId, articleId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  async updateComment(id: string, updates: { content?: string; status?: string }): Promise<Comment | undefined> {
    const result = await db
      .update(comments)
      .set(updates)
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning();
    return result.length > 0;
  }

  // Reaction methods
  async getReactionsByArticle(articleId: string): Promise<Reaction[]> {
    return await db.select().from(reactions).where(eq(reactions.articleId, articleId));
  }

  async getUserReactionForArticle(userId: string, articleId: string): Promise<Reaction | undefined> {
    const result = await db
      .select()
      .from(reactions)
      .where(and(eq(reactions.userId, userId), eq(reactions.articleId, articleId)))
      .limit(1);
    return result[0];
  }

  async toggleReaction(userId: string, articleId: string, type: string): Promise<Reaction | null> {
    const existing = await this.getUserReactionForArticle(userId, articleId);
    
    if (existing) {
      if (existing.type === type) {
        await db.delete(reactions).where(eq(reactions.id, existing.id));
        return null;
      } else {
        const result = await db
          .update(reactions)
          .set({ type })
          .where(eq(reactions.id, existing.id))
          .returning();
        return result[0];
      }
    } else {
      const result = await db
        .insert(reactions)
        .values({ userId, articleId, type })
        .returning();
      return result[0];
    }
  }

  // Bookmark methods
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));
  }

  async getUserBookmarkForArticle(userId: string, articleId: string): Promise<Bookmark | undefined> {
    const result = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
      .limit(1);
    return result[0];
  }

  async toggleBookmark(userId: string, articleId: string): Promise<Bookmark | null> {
    const existing = await this.getUserBookmarkForArticle(userId, articleId);
    
    if (existing) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
      return null;
    } else {
      const result = await db
        .insert(bookmarks)
        .values({ userId, articleId })
        .returning();
      return result[0];
    }
  }
}

export const storage = new DBStorage();
