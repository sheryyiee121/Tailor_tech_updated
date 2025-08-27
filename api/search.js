// Vercel Serverless Function for Google Custom Search API
// This will be deployed as /api/search endpoint

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q: query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Your Google Custom Search API credentials
    const API_KEY = "AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE";
    const CX = "e7c5ff0f989d54294";

    try {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
        )}&cx=${CX}&searchType=image&key=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error('Google API Error:', data);
            return res.status(500).json({
                error: 'Failed to fetch from Google Custom Search API',
                details: data.error?.message || 'Unknown error'
            });
        }

        const items = data.items?.map(item => ({
            title: item.title,
            link: item.link, // image URL
            context: item.image?.contextLink || item.link, // where it came from
            snippet: item.snippet,
            displayLink: item.displayLink
        })) || [];

        return res.status(200).json({
            success: true,
            results: items,
            totalResults: data.searchInformation?.totalResults || 0
        });
    } catch (error) {
        console.error('Error fetching from Google Custom Search API:', error);
        return res.status(500).json({
            error: 'Failed to fetch results from Google Custom Search API',
            details: error.message
        });
    }
}
