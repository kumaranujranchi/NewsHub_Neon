import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { storage } from "../../server/storage";
import { insertArticleSchema } from "../../shared/schema";

// Helper function to parse JSON body
const parseBody = (event: HandlerEvent) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
};

// Helper function to get query parameters
const getQueryParams = (event: HandlerEvent) => {
  return event.queryStringParameters || {};
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

// Main API handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return createResponse(200, {});
  }

  const path = event.path.replace("/.netlify/functions/api", "");
  const method = event.httpMethod;
  const body = parseBody(event);
  const query = getQueryParams(event);

  try {
    // Articles endpoints
    if (path === "/articles" && method === "GET") {
      const { category, region, status, authorId, featured, limit, offset } = query;
      const articles = await storage.getArticles({
        category: category as string,
        region: region as string,
        status: status as string,
        authorId: authorId as string,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      return createResponse(200, articles);
    }

    if (path === "/articles/search" && method === "GET") {
      const { q, category, region } = query;
      
      const searchQuery = typeof q === 'string' ? q.trim() : '';
      const searchCategory = typeof category === 'string' && category ? category.trim() : undefined;
      const searchRegion = typeof region === 'string' && region ? region.trim() : undefined;

      if (!searchQuery && !searchCategory && !searchRegion) {
        return createResponse(400, { message: "At least one search parameter required" });
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

      return createResponse(200, results);
    }

    // Single article by ID
    if (path.match(/^\/articles\/[^\/]+$/) && method === "GET") {
      const id = path.split("/")[2];
      const article = await storage.getArticle(id);
      if (!article) {
        return createResponse(404, { message: "Article not found" });
      }
      return createResponse(200, article);
    }

    // Article by slug
    if (path.match(/^\/articles\/by-slug\/[^\/]+$/) && method === "GET") {
      const slug = path.split("/")[3];
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return createResponse(404, { message: "Article not found" });
      }
      return createResponse(200, article);
    }

    // Increment article views
    if (path.match(/^\/articles\/[^\/]+\/views$/) && method === "POST") {
      const id = path.split("/")[2];
      await storage.incrementArticleViews(id);
      return createResponse(204, {});
    }

    // Get comments for article
    if (path.match(/^\/articles\/[^\/]+\/comments$/) && method === "GET") {
      const id = path.split("/")[2];
      const comments = await storage.getCommentsByArticle(id);
      return createResponse(200, comments);
    }

    // Default 404 for unmatched routes
    return createResponse(404, { message: "Endpoint not found" });

  } catch (error) {
    console.error("API Error:", error);
    return createResponse(500, { message: "Internal server error" });
  }
};