import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { storage } from "../../server/storage";

// Helper function to parse JSON body
const parseBody = (event: HandlerEvent) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
};

// Helper function to create response
const createResponse = (statusCode: number, body: any, headers: Record<string, string> = {}) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

// Simple JWT verification (you'll need to implement proper JWT verification)
const verifyToken = (authHeader: string | undefined): { sub: string } | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // TODO: Implement proper JWT verification with your auth provider
  // This is a placeholder - replace with actual JWT verification
  const token = authHeader.substring(7);
  
  // For now, return a mock user - REPLACE THIS WITH REAL JWT VERIFICATION
  if (token === 'mock-token') {
    return { sub: 'mock-user-id' };
  }
  
  return null;
};

// Authentication middleware
const requireAuth = (event: HandlerEvent): { sub: string } | Response => {
  const user = verifyToken(event.headers.authorization);
  if (!user) {
    return createResponse(401, { message: "Unauthorized" }) as any;
  }
  return user;
};

// Role-based access control
const requireRole = async (event: HandlerEvent, requiredRole: 'editor' | 'admin'): Promise<any | Response> => {
  const authResult = requireAuth(event);
  if ('statusCode' in authResult) {
    return authResult;
  }
  
  const dbUser = await storage.getUser(authResult.sub);
  if (!dbUser) {
    return createResponse(404, { message: "User not found" });
  }
  
  if (requiredRole === 'admin' && dbUser.role !== 'admin') {
    return createResponse(403, { message: "Forbidden: Admin access required" });
  }
  
  if (requiredRole === 'editor' && dbUser.role !== 'editor' && dbUser.role !== 'admin') {
    return createResponse(403, { message: "Forbidden: Editor or Admin access required" });
  }
  
  return { user: authResult, dbUser };
};

// Main auth handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return createResponse(200, {});
  }

  const path = event.path.replace("/.netlify/functions/auth", "");
  const method = event.httpMethod;
  const body = parseBody(event);

  try {
    // Get current user
    if (path === "/user" && method === "GET") {
      const authResult = requireAuth(event);
      if ('statusCode' in authResult) {
        return authResult;
      }
      
      const user = await storage.getUser(authResult.sub);
      if (!user) {
        return createResponse(404, { message: "User not found" });
      }
      return createResponse(200, user);
    }

    // Create article (requires editor role)
    if (path === "/articles" && method === "POST") {
      const roleResult = await requireRole(event, 'editor');
      if ('statusCode' in roleResult) {
        return roleResult;
      }
      
      try {
        const validatedData = insertArticleSchema.parse(body);
        const article = await storage.createArticle({
          ...validatedData,
          authorId: roleResult.dbUser.id,
        });
        return createResponse(201, article);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return createResponse(400, { message: "Invalid article data", errors: error.errors });
        }
        throw error;
      }
    }

    // Update article (requires editor role)
    if (path.match(/^\/articles\/[^\/]+$/) && method === "PATCH") {
      const roleResult = await requireRole(event, 'editor');
      if ('statusCode' in roleResult) {
        return roleResult;
      }
      
      const id = path.split("/")[2];
      const article = await storage.getArticle(id);
      if (!article) {
        return createResponse(404, { message: "Article not found" });
      }
      
      if (article.authorId !== roleResult.dbUser.id && roleResult.dbUser.role !== 'admin') {
        return createResponse(403, { message: "Forbidden: You can only edit your own articles" });
      }
      
      const allowedFields = ['title', 'subtitle', 'slug', 'content', 'excerpt', 'category', 'region', 'imageUrl', 'status', 'featured', 'readTime', 'publishedAt'];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }
      
      if (Object.keys(updateData).length === 0) {
        return createResponse(400, { message: "No valid fields to update" });
      }
      
      const updatedArticle = await storage.updateArticle(id, updateData);
      return createResponse(200, updatedArticle);
    }

    // Delete article (requires admin role)
    if (path.match(/^\/articles\/[^\/]+$/) && method === "DELETE") {
      const roleResult = await requireRole(event, 'admin');
      if ('statusCode' in roleResult) {
        return roleResult;
      }
      
      const id = path.split("/")[2];
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return createResponse(404, { message: "Article not found" });
      }
      return createResponse(204, {});
    }

    // Create comment (requires authentication)
    if (path === "/comments" && method === "POST") {
      const authResult = requireAuth(event);
      if ('statusCode' in authResult) {
        return authResult;
      }
      
      const { articleId, content, parentId } = body;
      
      if (!articleId || !content || typeof content !== 'string' || content.trim().length === 0) {
        return createResponse(400, { message: "Article ID and valid content are required" });
      }
      
      const comment = await storage.createComment({
        articleId,
        userId: authResult.sub,
        content: content.trim(),
        parentId: parentId || null,
      });
      return createResponse(201, comment);
    }

    // Default 404 for unmatched routes
    return createResponse(404, { message: "Endpoint not found" });

  } catch (error) {
    console.error("Auth API Error:", error);
    return createResponse(500, { message: "Internal server error" });
  }
};