import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;

// Your Google Custom Search API credentials
const API_KEY = "AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE";
const CX = "e7c5ff0f989d54294";

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

        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
        )}&cx=${CX}&searchType=image&key=${API_KEY}&num=10`;

        const response = await axios.get(url);

        const items = response.data.items?.map(item => ({
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
