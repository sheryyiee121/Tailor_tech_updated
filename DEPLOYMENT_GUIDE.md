# 🚀 Deployment Guide for TailorTech on Vercel

## Prerequisites
- Vercel account (free at vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Your API keys ready

## Step 1: Prepare Your Project

### 1.1 Update package.json scripts
Make sure your `package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.2 Environment Variables
The project uses these environment variables:
- `GOOGLE_API_KEY` - Your Google Custom Search API key
- `GOOGLE_CX` - Your Custom Search Engine ID  
- `SCRAPINGDOG_API_KEY` - Your ScrapingDog API key

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. In your project directory (tailortech folder):
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project? **No** (first time)
   - What's your project name? **tailortech**
   - In which directory is your code? **./** (current directory)
   - Want to override settings? **No**

### Option B: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **tailortech** (if in a subdirectory)
   - Build Command: **npm run build**
   - Output Directory: **dist**

## Step 3: Configure Environment Variables in Vercel

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add these variables:

```
GOOGLE_API_KEY = AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE
GOOGLE_CX = e7c5ff0f989d54294
SCRAPINGDOG_API_KEY = 68ad90441e87f945fc84bf5f
```

## Step 4: Backend API Configuration

The project includes a serverless function for Google Custom Search that automatically deploys with your frontend.

### API Endpoint
- **Local Development**: `http://localhost:5000/search`
- **Production (Vercel)**: `https://your-app.vercel.app/api/search`

The service automatically detects the environment and uses the correct endpoint.

## Step 5: Test Your Deployment

After deployment:

1. **Test the main app**:
   - Sign in with Google
   - Enter a prompt like "red leather jacket"
   - Generate design
   - Test the animation page

2. **Test the search API**:
   ```
   https://your-app.vercel.app/api/search?q=red+leather+jacket
   ```

3. **Test the custom order form**:
   - Navigate to custom order
   - Fill in the form
   - Ensure typing works smoothly

## Troubleshooting

### CORS Issues
The API already includes CORS headers. If you still face issues:
1. Check that your domain is correctly set in Vercel
2. Clear browser cache
3. Try incognito mode

### API Not Working
1. Check environment variables are set in Vercel dashboard
2. Check function logs in Vercel dashboard
3. Verify API keys are correct

### Build Failures
1. Make sure all dependencies are in `package.json`
2. Check for any hardcoded localhost URLs
3. Ensure `vite.config.js` is properly configured

## Local Development with Vercel Functions

To test Vercel functions locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run development server with functions
vercel dev
```

This will run both your Vite dev server and the serverless functions locally.

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Remove any console.log statements with sensitive data
- [ ] Update Firebase authorized domains to include Vercel URL
- [ ] Test all features in production
- [ ] Monitor function usage (free tier has limits)

## Monitoring

Vercel provides:
- Real-time function logs
- Analytics dashboard
- Error tracking
- Performance metrics

Access these in your Vercel dashboard under your project.

## Custom Domain (Optional)

1. Go to Settings → Domains in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains

## Support

- Vercel Docs: https://vercel.com/docs
- Vite + Vercel: https://vercel.com/guides/deploying-vite-with-vercel
- API Routes: https://vercel.com/docs/functions

---

Your app is now ready for production deployment! 🎉
