# Complete Google Integration Setup for TailorTech

## 🔧 Current Configuration Status

✅ **Google OAuth Client ID**: `32113548126-1750n497pi68lj2gtbnp00cb32v4vgib.apps.googleusercontent.com`
- Already configured in `src/firebase/config.js`
- Used for Google Sign-In authentication

## 🚀 Next Steps Required

### 1. Get Google Custom Search API Key

You need to create an API key for the Custom Search functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Enable the **Custom Search API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

### 2. Create Custom Search Engine

1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. Configuration:
   - **Sites to search**: Enter `*.com` (or specific fashion sites)
   - **Name**: "TailorTech Fashion Search"
   - **Language**: English
4. Click "Create"
5. Copy the **Search Engine ID** from the setup page

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```env
# Google Custom Search API (REQUIRED for search functionality)
# Note: Vite uses VITE_ prefix instead of REACT_APP_
VITE_GOOGLE_API_KEY=AIzaSyDBBrn9K5vt-TbBzslCBkn7OzBFA4ayZuI
VITE_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_from_step_2

# Google OAuth (ALREADY CONFIGURED in Firebase)
VITE_GOOGLE_CLIENT_ID=32113548126-1750n497pi68lj2gtbnp00cb32v4vgib.apps.googleusercontent.com
```

### 4. Enhanced Search Engine Setup (Recommended)

To get better fashion-related results:

1. In your Custom Search Engine settings:
   - Enable **"Image search"**
   - Enable **"Safe search"**
   
2. Add specific fashion websites:
   ```
   amazon.com/s?k=
   zara.com
   hm.com
   uniqlo.com
   asos.com
   nordstrom.com
   macys.com
   target.com
   walmart.com
   ```

3. Add fashion-related keywords:
   ```
   clothing, fashion, apparel, shirt, dress, jacket, pants, 
   outfit, style, wear, garment, textile, fabric
   ```

## 🎯 Features That Will Work After Setup

### ✅ Currently Working
- Google Sign-In authentication
- Firebase user management
- Dashboard with black/white theme
- 3D model generation and animation
- Custom order system

### 🔄 Will Work After API Setup
- **Google Lens-like search**: Find similar clothing items online
- **Price comparison**: Extract prices from search results
- **Multi-site search**: Search across multiple fashion websites
- **Image-based search**: Search using generated 3D clothing images

## 🧪 Testing the Setup

1. **Test Authentication** (should already work):
   ```bash
   npm run dev
   ```
   - Go to sign-in page
   - Click "Sign in with Google"
   - Should authenticate successfully

2. **Test Search Functionality** (after API setup):
   - Generate a 3D clothing design
   - Wait for animation to complete (30 seconds)
   - Click "Search Similar Items Online"
   - Should show search results from various fashion websites

## 🔒 Security Best Practices

1. **API Key Restrictions**:
   - In Google Cloud Console → Credentials
   - Edit your API key
   - Add "HTTP referrers" restriction
   - Add your domain: `localhost:5173`, `your-domain.com`

2. **OAuth Client Restrictions**:
   - Your OAuth client should be restricted to your domain
   - Add authorized JavaScript origins and redirect URIs

## 💰 API Limits & Costs

- **Custom Search API**: 100 queries/day (free tier)
- **OAuth**: Free for authentication
- **For Production**: Consider upgrading to paid tier for higher limits

## 🐛 Troubleshooting

### Common Issues:

1. **"process is not defined" Error**:
   - **FIXED**: Updated to use `import.meta.env` instead of `process.env`
   - Make sure you're using the latest code version
   - Environment variables should use `VITE_` prefix

2. **White screen/App not loading**:
   - **FIXED**: Added fallback mock data when API keys are missing
   - App now works without Google API keys (shows demo data)
   - Check browser console for any remaining errors

3. **"API key not valid"**:
   - Check if Custom Search API is enabled
   - Verify API key is correct in `.env` file
   - Make sure to use `VITE_GOOGLE_API_KEY` (not `REACT_APP_`)

4. **"Search engine not found"**:
   - Verify Search Engine ID is correct
   - Make sure search engine is public
   - Use `VITE_GOOGLE_SEARCH_ENGINE_ID` in `.env`

5. **No search results**:
   - Without API keys: Shows mock/demo data
   - With API keys: Check if search engine has sites configured
   - Try broader search terms

6. **Authentication issues**:
   - Verify OAuth client ID in Firebase config
   - Check authorized domains in Google Console

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test API endpoints manually using tools like Postman
4. Check Google Cloud Console for API usage and errors

---

**Next Action**: Get your Google Custom Search API key and Search Engine ID to complete the setup! 🚀
