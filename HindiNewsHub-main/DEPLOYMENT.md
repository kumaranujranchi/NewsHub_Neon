# Deployment Guide: Hindi News Hub on Netlify with Neon Database

This guide walks you through deploying the Hindi News Hub application on Netlify with a Neon PostgreSQL database.

## Prerequisites

- GitHub account
- Netlify account
- Neon account (https://neon.tech)
- Node.js 20+ installed locally

## 1. Neon Database Setup

### Step 1: Create Neon Project
1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a project name (e.g., "hindi-news-hub")
4. Select your preferred region
5. Click "Create Project"

### Step 2: Get Database Connection String
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this for later use in environment variables

### Step 3: Initialize Database Schema
1. Install dependencies locally:
   ```bash
   npm install
   ```

2. Set up your local environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your Neon DATABASE_URL
   ```

3. Push the database schema to Neon:
   ```bash
   npm run db:push
   ```

## 2. Netlify Deployment Setup

### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your `NewsHub_Neon` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/client`
   - **Functions directory**: `netlify/functions`

### Step 2: Configure Environment Variables
In Netlify dashboard, go to Site Settings > Environment Variables and add:

**Required Variables:**
```
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
SESSION_SECRET=your-super-secure-session-secret-key
```

**Optional Variables (if using external auth):**
```
ISSUER_URL=https://your-auth-provider.com/oidc
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

### Step 3: Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## 3. Post-Deployment Configuration

### Step 1: Verify Database Connection
1. Check the Netlify function logs to ensure database connectivity
2. Test API endpoints:
   - `GET /api/articles` - Should return articles
   - `GET /api/articles/search?q=test` - Should return search results

### Step 2: Set Up Custom Domain (Optional)
1. In Netlify dashboard, go to Domain Settings
2. Add your custom domain
3. Configure DNS settings as instructed
4. Enable HTTPS (automatic with Netlify)

### Step 3: Configure Branch Deploys
1. Go to Site Settings > Build & Deploy > Deploy Contexts
2. Set up deploy previews for pull requests
3. Configure branch deploys if needed

## 4. Environment-Specific Configurations

### Production Environment Variables
```bash
# Required for production
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
NODE_ENV=production
SESSION_SECRET=secure-random-string-min-32-chars

# Optional for enhanced functionality
JWT_SECRET=another-secure-random-string
ISSUER_URL=https://your-auth-provider.com/oidc
CLIENT_ID=your-oauth-client-id
CLIENT_SECRET=your-oauth-client-secret
```

### Development Environment Variables
```bash
# For local development
DATABASE_URL=postgresql://localhost:5432/hindinewshub_dev
NODE_ENV=development
SESSION_SECRET=dev-secret-key
PORT=5000
```

## 5. API Endpoints

The application provides the following API endpoints via Netlify Functions:

### Public Endpoints (/.netlify/functions/api)
- `GET /articles` - List articles with filtering
- `GET /articles/search` - Search articles
- `GET /articles/:id` - Get article by ID
- `GET /articles/by-slug/:slug` - Get article by slug
- `POST /articles/:id/views` - Increment article views
- `GET /articles/:id/comments` - Get article comments

### Authenticated Endpoints (/.netlify/functions/auth)
- `GET /user` - Get current user
- `POST /articles` - Create article (Editor+)
- `PATCH /articles/:id` - Update article (Editor+)
- `DELETE /articles/:id` - Delete article (Admin)
- `POST /comments` - Create comment

## 6. Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (should be 20+)
- Verify all dependencies are in package.json
- Check for TypeScript errors in build logs

**Database Connection Issues:**
- Verify DATABASE_URL format
- Ensure Neon database is active
- Check connection string permissions

**Function Errors:**
- Check Netlify function logs
- Verify environment variables are set
- Ensure proper CORS headers

**Authentication Issues:**
- Verify JWT_SECRET is set
- Check auth provider configuration
- Ensure proper session management

### Monitoring and Logs
1. **Netlify Logs**: Site Settings > Functions > View logs
2. **Neon Monitoring**: Neon Console > Monitoring
3. **Performance**: Netlify Analytics (if enabled)

## 7. Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **Database**: Use connection pooling for better performance
3. **CORS**: Configured in netlify.toml for security
4. **Headers**: Security headers set in netlify.toml
5. **Authentication**: Implement proper JWT verification

## 8. Performance Optimization

1. **Caching**: Static assets cached for 1 year
2. **Database**: Use Neon's connection pooling
3. **Functions**: Keep function code minimal
4. **Images**: Consider using Cloudinary or similar CDN

## 9. Backup and Recovery

1. **Database Backups**: Neon provides automatic backups
2. **Code Backups**: GitHub repository serves as backup
3. **Environment Variables**: Document all variables securely

## Support

For issues:
1. Check Netlify documentation: https://docs.netlify.com/
2. Check Neon documentation: https://neon.tech/docs/
3. Review application logs in respective dashboards