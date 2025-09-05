import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Your Google Custom Search API credentials
const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE";
const CX = process.env.GOOGLE_SEARCH_ENGINE_ID || "e7c5ff0f989d54294";

// Enable CORS for frontend requests
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        status: "TailorTech Google Search Proxy Server Running",
        endpoints: ["/search", "/health"]
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Google Custom Search endpoint
app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        console.log(`Searching for: "${query}"`);

        // Filter results to focus on actual clothing items
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
        )}&cx=${CX}&searchType=image&key=${API_KEY}&num=20&imgType=photo&imgSize=large`;

        const response = await axios.get(url);

        // Filter out irrelevant items with comprehensive filtering
        const excludeKeywords = [
            // Accessories
            'bag', 'purse', 'handbag', 'wallet', 'clutch', 'tote', 'satchel', 'backpack', 'pouch', 'accessory',
            // Jewelry & Watches
            'jewelry', 'watch', 'necklace', 'bracelet', 'ring', 'earring', 'chain',
            // Footwear
            'shoe', 'boot', 'sneaker', 'sandal', 'heel', 'loafer', 'slipper',
            // Other accessories
            'belt', 'hat', 'cap', 'sunglasses', 'scarf', 'glove', 'tie',
            // Non-clothing items
            'phone', 'case', 'cover', 'toy', 'doll', 'food', 'drink', 'furniture', 'electronics',
            'home', 'kitchen', 'car', 'auto', 'book', 'magazine', 'poster', 'art', 'painting'
        ];

        // Positive clothing keywords
        const clothingKeywords = ['shirt', 'dress', 'jacket', 'coat', 'pants', 'jeans', 'skirt', 'blouse', 'sweater', 'hoodie', 'top', 'bottom', 'clothing', 'apparel', 'fashion'];

        const items = response.data.items?.filter(item => {
            const titleLower = (item.title || '').toLowerCase();
            const snippetLower = (item.snippet || '').toLowerCase();
            const contextLower = (item.image?.contextLink || '').toLowerCase();
            const combinedText = `${titleLower} ${snippetLower} ${contextLower}`;

            // Check if it has irrelevant keywords
            const hasIrrelevantKeyword = excludeKeywords.some(keyword =>
                combinedText.includes(keyword)
            );

            // Check if it has clothing keywords
            const hasClothingKeyword = clothingKeywords.some(keyword =>
                combinedText.includes(keyword)
            );

            // Return items that don't have irrelevant keywords OR have strong clothing keywords
            return !hasIrrelevantKeyword || hasClothingKeyword;
        }).map(item => ({
            title: item.title,
            link: item.link, // image URL
            context: item.image.contextLink, // where it came from
            thumbnail: item.image.thumbnailLink,
            snippet: item.snippet || item.title,
            displayLink: item.displayLink
        })) || [];

        console.log(`Found ${items.length} results for "${query}"`);

        res.json({
            results: items,
            query: query,
            total: items.length,
            searchType: 'image'
        });

    } catch (error) {
        console.error('Search error:', error.response?.data || error.message);

        if (error.response?.status === 429) {
            res.status(429).json({
                error: "API rate limit exceeded. Please try again later.",
                retryAfter: error.response.headers['retry-after'] || 60
            });
        } else if (error.response?.status === 403) {
            res.status(403).json({
                error: "API access denied. Check your API key and permissions."
            });
        } else {
            res.status(500).json({
                error: "Failed to fetch search results",
                details: error.message
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TailorTech Search Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Google Custom Search API: ${API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`🔍 Search Engine ID: ${CX}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173, http://localhost:3000`);
});

export default app;
