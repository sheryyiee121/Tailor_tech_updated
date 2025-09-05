export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q: query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const API_KEY = process.env.GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_SEARCH_ENGINE_ID || process.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

    if (!API_KEY || !CX) {
        console.error('Missing API credentials');
        return res.status(500).json({ error: 'Search service is not configured' });
    }

    try {
        // Simple search query that was working
        const searchQuery = `${query} clothing`;

        console.log(`🔍 API Debug - Original query: "${query}"`);
        console.log(`🔍 API Debug - Search query: "${searchQuery}"`);
        console.log(`🔍 API Debug - API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
        console.log(`🔍 API Debug - Search Engine ID: ${CX ? CX : 'NOT SET'}`);

        // Simple working parameters - increase results to 10
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            searchQuery
        )}&cx=${CX}&key=${API_KEY}&num=10&searchType=image&imgType=photo&imgSize=medium`;

        console.log(`🔍 API Debug - Testing with minimal URL`);

        const response = await fetch(url);
        const data = await response.json();

        console.log(`🔍 API Debug - Response Status: ${response.status}`);
        if (!response.ok) {
            console.error(`🔍 API Debug - Error Response:`, data);
        } else {
            console.log(`🔍 API Debug - Success! Found ${data.items?.length || 0} results`);
        }

        if (!response.ok) {
            throw new Error(data.error?.message || 'Search API error');
        }

        // Simple filtering - just remove obvious non-clothing items
        const excludeKeywords = ['bag', 'purse', 'handbag', 'wallet', 'jewelry', 'watch', 'phone', 'case'];

        const items = (data.items || [])
            .filter(item => {
                const titleLower = (item.title || '').toLowerCase();
                const snippetLower = (item.snippet || '').toLowerCase();
                const combinedText = `${titleLower} ${snippetLower}`;

                // Filter out obvious non-clothing items
                return !excludeKeywords.some(keyword => combinedText.includes(keyword));
            })
            .map(item => ({
                title: item.title,
                link: item.link, // This is the image URL for image search
                displayLink: item.displayLink,
                snippet: item.snippet,
                thumbnail: item.image?.thumbnailLink,
                context: item.image?.contextLink, // This is the webpage where image was found
                image: item.link, // Add image field for frontend
            }));

        res.status(200).json({
            results: items,
            searchInformation: data.searchInformation
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Failed to fetch search results',
            details: error.message
        });
    }
}