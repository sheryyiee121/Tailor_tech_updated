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
        // Add clothing-specific search parameters
        const searchQuery = `${query} -bag -purse -handbag -wallet -accessory clothing wear apparel outfit jacket shirt dress`;

        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            searchQuery
        )}&cx=${CX}&searchType=image&imgType=photo&imgSize=large&key=${API_KEY}&num=10`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Search API error');
        }

        // Filter out accessories from results
        const accessoryKeywords = ['bag', 'purse', 'handbag', 'wallet', 'clutch', 'tote', 'satchel', 'backpack', 'pouch', 'accessory'];

        const items = (data.items || [])
            .filter(item => {
                const titleLower = (item.title || '').toLowerCase();
                const snippetLower = (item.snippet || '').toLowerCase();
                const contextLower = (item.image?.contextLink || '').toLowerCase();

                // Check if any accessory keyword is in the title, snippet, or context
                return !accessoryKeywords.some(keyword =>
                    titleLower.includes(keyword) ||
                    snippetLower.includes(keyword) ||
                    contextLower.includes(keyword)
                );
            })
            .map(item => ({
                title: item.title,
                link: item.link,
                displayLink: item.displayLink,
                snippet: item.snippet,
                thumbnail: item.image?.thumbnailLink,
                context: item.image?.contextLink,
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