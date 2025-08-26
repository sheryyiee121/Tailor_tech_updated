# Google Search API Setup Guide

This guide will help you set up Google Custom Search API for the search functionality in TailorTech.

## Prerequisites

1. Google Cloud Console account
2. Google Custom Search Engine

## Step 1: Create Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

## Step 2: Create Custom Search Engine

1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. Enter `*.com` as the site to search (or specific fashion sites)
4. Create the search engine
5. Copy the Search Engine ID from the setup page

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with:

```env
# Google Custom Search API (Vite uses VITE_ prefix)
VITE_GOOGLE_API_KEY=AIzaSyDBBrn9K5vt-TbBzslCBkn7OzBFA4ayZuI
VITE_GOOGLE_SEARCH_ENGINE_ID=your_custom_search_engine_id_here

# Google OAuth Client ID (already configured in Firebase config)
VITE_GOOGLE_CLIENT_ID=32113548126-1750n497pi68lj2gtbnp00cb32v4vgib.apps.googleusercontent.com
```

**Note**: Your Google OAuth Client ID is already configured in the Firebase configuration file.

## Step 4: Customize Search Engine (Optional)

1. In your Custom Search Engine settings:
   - Enable "Image search"
   - Add specific fashion websites like:
     - amazon.com
     - zara.com
     - hm.com
     - uniqlo.com
     - asos.com
     - nordstrom.com

## Features Implemented

### 1. Google Lens-like Search
- **File**: `src/services/googleLensService.js`
- Searches for similar clothing items using Google Custom Search API
- Enhances search queries with fashion-related keywords
- Formats results with price extraction

### 2. Search Results Page
- **File**: `src/pages/search/SearchResults.jsx`
- Displays search results in a clean grid layout
- Shows product images, titles, prices, and links
- Handles loading states and errors
- Option to place custom order if no results found

### 3. Custom Order Page
- **File**: `src/pages/order/CustomOrder.jsx`
- Multi-step form for custom orders
- Collects personal information, shipping address, and order details
- Shows order summary and pricing
- Handles order submission

### 4. Animation Integration
- **File**: `src/pages/model/animation.jsx`
- Auto-shows search options after 30 seconds of animation
- Provides choice between searching online or placing custom order
- Passes design data to subsequent pages

## Usage Flow

1. User generates 3D clothing design
2. Animation plays for 30 seconds
3. Modal appears with options:
   - **Search Similar Items**: Uses Google API to find similar products online
   - **Place Custom Order**: Goes directly to custom order form
4. If search finds results: User can buy from existing stores
5. If no results found: User can place custom order with personal details

## API Limits

- Google Custom Search API: 100 queries/day (free tier)
- For production: Consider upgrading to paid tier

## Security Notes

- API keys should be kept secure
- Consider implementing server-side proxy for production
- Rate limiting recommended for API calls

## Testing

To test without API keys:
- The search will show a "not configured" error
- Users can still access the custom order functionality
- Mock data can be added for development testing
