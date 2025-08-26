// Netlify Function for Google Custom Search API
// This will be deployed as /.netlify/functions/search endpoint

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const query = event.queryStringParameters?.q;

    if (!query) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ error: "Query parameter 'q' is required" })
        };
    }

    // Your Google Custom Search API credentials
    const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE";
    const CX = process.env.GOOGLE_CX || "e7c5ff0f989d54294";

    try {
        const fetch = await import('node-fetch').then(mod => mod.default);

        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
        )}&cx=${CX}&searchType=image&key=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error('Google API Error:', data);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    error: 'Failed to fetch from Google Custom Search API',
                    details: data.error?.message || 'Unknown error'
                })
            };
        }

        const items = data.items?.map(item => ({
            title: item.title,
            link: item.link, // image URL
            context: item.image?.contextLink || item.link,
            snippet: item.snippet,
            displayLink: item.displayLink
        })) || [];

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                results: items,
                totalResults: data.searchInformation?.totalResults || 0
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: 'Failed to fetch results',
                details: error.message
            })
        };
    }
};
