# Deploying Camparakeet to Vercel

This guide will walk you through deploying your Camparakeet app to Vercel. Vercel is the recommended hosting platform for Next.js applications and offers free hosting for personal projects.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account (for automatic deployments)
- OR Vercel CLI installed (for manual deployment)
- Your project should be in a Git repository

## Method 1: Deploy via Vercel Dashboard (Recommended)

This is the easiest method and enables automatic deployments on every push.

### Step 1: Push to GitHub

1. Create a new repository on GitHub (if you haven't already)
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/camparakeet.git
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"** or **"Import Project"**
3. Import your Git repository:
   - If using GitHub, click **"Import"** next to your repository
   - Or click **"Import Git Repository"** and paste your repo URL
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Configure Environment Variables (Optional)

If you plan to add real AI APIs later:

1. In the project settings, go to **"Environment Variables"**
2. Add your variables:
   - `OPENAI_API_KEY` = `your_api_key_here`
   - Add any other environment variables you need

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Automatic Deployments

- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
- Pull requests = Preview deployment with unique URL

## Method 2: Deploy via Vercel CLI

If you prefer command-line deployment:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy

From your project directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → `camparakeet` (or your preferred name)
- **Directory?** → `./` (press Enter)
- **Override settings?** → No (press Enter)

### Step 4: Deploy to Production

For production deployment:

```bash
vercel --prod
```

## Method 3: Deploy via GitHub Actions (Advanced)

You can also set up CI/CD with GitHub Actions, but Vercel's built-in integration is usually easier.

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables

To add environment variables after deployment:

1. Go to project settings → **"Environment Variables"**
2. Add variables for Production, Preview, and Development
3. Redeploy for changes to take effect

### Viewing Logs

- **Dashboard**: View build and function logs in Vercel dashboard
- **CLI**: `vercel logs [deployment-url]`

## Important Notes

### Data Persistence

⚠️ **Current Limitation**: The app uses in-memory storage, so:
- Campaigns are lost on each deployment
- Campaigns are lost if the server restarts
- Each user session is independent

**To fix this**, you'll need to:
1. Add a database (Vercel Postgres, Supabase, MongoDB Atlas, etc.)
2. Replace `lib/campaignStore.ts` with real database calls
3. Add environment variables for database connection

### Build Settings

Vercel automatically detects Next.js and uses these settings:
- **Node.js Version**: 18.x (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

You can override these in project settings if needed.

### Performance

Vercel automatically:
- Optimizes images
- Enables edge caching
- Provides CDN distribution
- Handles serverless functions

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compiles: `npm run build` locally
4. Check for environment variable issues

### App Works Locally but Not on Vercel

1. Check browser console for errors
2. Verify all API routes work (if any)
3. Check environment variables are set
4. Review Vercel function logs

### TypeScript Errors

If you see TypeScript errors during build:
- Run `npm run build` locally first to catch errors
- Ensure `tsconfig.json` is properly configured
- Check that all imports are correct

## Next Steps After Deployment

1. **Add Analytics**: Enable Vercel Analytics in project settings
2. **Set Up Monitoring**: Use Vercel's built-in monitoring
3. **Add Database**: Integrate a database for persistent storage
4. **Configure Custom Domain**: Add your own domain name
5. **Set Up CI/CD**: Already done automatically with Git integration!

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

