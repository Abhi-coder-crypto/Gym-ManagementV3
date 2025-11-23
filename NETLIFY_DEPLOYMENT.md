# Netlify Deployment Guide

This project has been configured for Netlify deployment. Follow these steps to deploy your application.

## Prerequisites

1. A [Netlify](https://www.netlify.com/) account
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Connect your repository:**
   - Log in to your Netlify account
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider and select your repository

2. **Configure build settings:**
   - Build command: `vite build && esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=netlify/functions`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`
   
   **Note:** These settings are already configured in `netlify.toml`, so Netlify should auto-detect them.

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - You'll get a URL like `https://your-app-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Project Structure

- **Frontend:** Built with Vite + React, deployed as static files
- **API:** Serverless functions powered by Express.js
- **Database:** Currently using in-memory storage. MongoDB integration can be added later.

## API Routes

All API routes are accessible at `/.netlify/functions/api/*` and are automatically redirected from `/api/*`.

Example:
- Frontend: `https://your-app.netlify.app/`
- API Health Check: `https://your-app.netlify.app/api/health`

## Adding MongoDB Later

When you're ready to add MongoDB:

1. Set up a MongoDB database (e.g., MongoDB Atlas)
2. Add your MongoDB connection string as an environment variable in Netlify:
   - Go to Site settings → Environment variables
   - Add `MONGODB_URI` with your connection string
3. Update the database connection code in `server/db.ts`
4. Redeploy

## Environment Variables

To add environment variables in Netlify:
1. Go to Site settings → Environment variables
2. Add your variables (e.g., API keys, database URLs)
3. Redeploy your site

## Custom Domain

To use a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Troubleshooting

- **Build fails:** Check the build logs in Netlify dashboard
- **Functions not working:** Ensure the functions directory is set to `netlify/functions`
- **API routes 404:** Check that redirects in `netlify.toml` are configured correctly

## Support

For Netlify-specific issues, check the [Netlify documentation](https://docs.netlify.com/).
