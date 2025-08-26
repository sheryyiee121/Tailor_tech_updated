// Import prompt storage service
import promptStorageService from './promptStorageService.js';

class GoogleLensService {
    constructor() {
        // ScrapingDog API for Google Lens functionality
        this.scrapingDogApiKey = '68ad90441e87f945fc84bf5f';
        this.scrapingDogBaseUrl = 'https://api.scrapingdog.com/google_lens';

        // Google Custom Search API with your credentials
        this.googleApiKey = 'AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE';
        this.searchEngineId = 'e7c5ff0f989d54294';

        // Backend proxy for Google Custom Search (to avoid CORS)
        // Auto-detect deployment platform
        this.backendUrl = this.detectBackendUrl();
    }

    /**
     * Detect the backend URL based on deployment platform
     * @returns {string} Backend URL
     */
    detectBackendUrl() {
        // Check if we're in development
        if (import.meta.env.DEV) {
            return 'http://localhost:5000';
        }

        // Check for custom backend URL
        if (import.meta.env.VITE_BACKEND_URL) {
            return import.meta.env.VITE_BACKEND_URL;
        }

        // Production - detect platform
        const hostname = window.location.hostname;

        // Vercel deployment
        if (hostname.includes('vercel.app') || hostname.includes('.vercel.app')) {
            return '/api';
        }

        // Netlify deployment
        if (hostname.includes('netlify.app') || hostname.includes('.netlify.app')) {
            return '/.netlify/functions';
        }

        // Default to relative API path
        return '/api';
    }

    /**
 * Search for similar clothing items using Google Lens via ScrapingDog API
 * @param {string} imageUrl - URL of the generated 3D clothing image
 * @param {string} prompt - Original text prompt used for generation
 * @returns {Promise<Object>} Search results
 */
    async searchSimilarClothing(imageUrl, prompt) {
        try {
            // 🚀 USE SAVED PROMPT IF NONE PROVIDED
            let searchPrompt = prompt;
            if (!searchPrompt) {
                searchPrompt = promptStorageService.getCurrentPrompt();
                console.log(`📂 Using saved prompt: "${searchPrompt}"`);
            }

            // Default fallback
            if (!searchPrompt) {
                searchPrompt = 'fashion clothing';
                console.log('🔄 Using default prompt: "fashion clothing"');
            }

            // First, try Google Lens image search if we have an image URL
            if (imageUrl && this.scrapingDogApiKey) {
                console.log('Using Google Lens image search via ScrapingDog API');
                const lensResults = await this.searchByImage(imageUrl);
                if (lensResults && lensResults.length > 0) {
                    return {
                        success: true,
                        results: lensResults,
                        searchType: 'image_lens',
                        query: searchPrompt,
                        imageUrl: imageUrl
                    };
                }
            }

            // Fallback to text-based search
            console.log('Falling back to text-based search');
            const textResults = await this.searchByText(searchPrompt);

            return {
                success: true,
                results: textResults,
                searchType: 'text',
                query: searchPrompt
            };
        } catch (error) {
            console.error('Search failed:', error);
            return {
                success: false,
                error: error.message,
                results: []
            };
        }
    }

    /**
 * Search using Google Lens via ScrapingDog API with image URL
 * @param {string} imageUrl - URL of the image to search
 * @returns {Promise<Array>} Search results
 */
    async searchByImage(imageUrl) {
        if (!this.scrapingDogApiKey) {
            throw new Error('ScrapingDog API key not configured');
        }

        try {
            const searchUrl = `${this.scrapingDogBaseUrl}?api_key=${this.scrapingDogApiKey}&url=${encodeURIComponent(imageUrl)}&country=us`;

            console.log('Making Google Lens search request:', searchUrl);

            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'TailorTech/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`ScrapingDog API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Google Lens API response:', data);

            return this.formatLensResults(data);
        } catch (error) {
            console.error('Google Lens search failed:', error);
            throw error;
        }
    }

    /**
     * Search using Google Custom Search API with text query
     * @param {string} query - Search query
     * @returns {Promise<Array>} Search results
     */
    async searchByText(query) {
        try {
            // Try backend proxy first (to avoid CORS issues)
            const enhancedQuery = `${query} buy online fashion clothing store`;
            const response = await fetch(`${this.backendUrl}/search?q=${encodeURIComponent(enhancedQuery)}`);

            if (response.ok) {
                const data = await response.json();
                return this.formatCustomSearchResults(data.results || []);
            }
        } catch (error) {
            console.warn('Backend proxy not available, using mock data:', error);
        }

        // Fallback to mock data if backend is not available
        console.warn('Using mock data for development.');
        return this.getMockSearchResults(query);
    }

    /**
 * Format Google Lens results from ScrapingDog API
 * @param {Object} data - Raw Google Lens API response
 * @returns {Array} Formatted results
 */
    formatLensResults(data) {
        try {
            // Handle different possible response structures from ScrapingDog
            let results = [];

            if (data.visual_matches) {
                results = data.visual_matches.map(item => ({
                    title: item.title || 'Fashion Item',
                    link: item.link || item.url || '#',
                    image: item.thumbnail || item.image || 'https://via.placeholder.com/300x400/cccccc/ffffff?text=Fashion+Item',
                    snippet: item.snippet || item.description || 'Similar fashion item found',
                    displayLink: this.extractDomain(item.link || item.url),
                    price: this.extractPrice(item.snippet || item.description || ''),
                    source: 'google_lens'
                }));
            } else if (data.results) {
                results = data.results.map(item => ({
                    title: item.title || 'Fashion Item',
                    link: item.link || item.url || '#',
                    image: item.thumbnail || item.image || 'https://via.placeholder.com/300x400/cccccc/ffffff?text=Fashion+Item',
                    snippet: item.snippet || item.description || 'Similar fashion item found',
                    displayLink: this.extractDomain(item.link || item.url),
                    price: this.extractPrice(item.snippet || item.description || ''),
                    source: 'google_lens'
                }));
            } else if (Array.isArray(data)) {
                results = data.map(item => ({
                    title: item.title || 'Fashion Item',
                    link: item.link || item.url || '#',
                    image: item.thumbnail || item.image || 'https://via.placeholder.com/300x400/cccccc/ffffff?text=Fashion+Item',
                    snippet: item.snippet || item.description || 'Similar fashion item found',
                    displayLink: this.extractDomain(item.link || item.url),
                    price: this.extractPrice(item.snippet || item.description || ''),
                    source: 'google_lens'
                }));
            }

            // Filter out invalid results and limit to 10
            return results
                .filter(item => item.link && item.link !== '#')
                .slice(0, 10);

        } catch (error) {
            console.error('Error formatting Lens results:', error);
            return [];
        }
    }

    /**
     * Extract domain from URL
     * @param {string} url - Full URL
     * @returns {string} Domain name
     */
    extractDomain(url) {
        if (!url) return 'unknown';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return 'unknown';
        }
    }

    /**
 * Format custom search results from backend proxy
 * @param {Array} items - Results from backend proxy
 * @returns {Array} Formatted results
 */
    formatCustomSearchResults(items) {
        return items.map(item => ({
            title: item.title || 'Fashion Item',
            link: item.context || item.link || '#',
            image: item.link || 'https://via.placeholder.com/300x400/cccccc/ffffff?text=Fashion+Item',
            snippet: item.title || 'Fashion item found via Google Custom Search',
            displayLink: this.extractDomain(item.context || item.link),
            price: this.extractPrice(item.title || ''),
            source: 'google_custom'
        }));
    }

    /**
     * Format search results for consistent structure
     * @param {Array} items - Raw search results
     * @returns {Array} Formatted results
     */
    formatSearchResults(items) {
        return items.map(item => ({
            title: item.title,
            link: item.link,
            image: item.image?.thumbnailLink || item.link,
            snippet: item.snippet,
            displayLink: item.displayLink,
            price: this.extractPrice(item.snippet),
            source: 'google'
        }));
    }

    /**
     * Extract price from snippet text
     * @param {string} snippet - Text snippet
     * @returns {string|null} Extracted price
     */
    extractPrice(snippet) {
        const priceRegex = /\$[\d,]+\.?\d*/g;
        const matches = snippet.match(priceRegex);
        return matches ? matches[0] : null;
    }

    /**
 * Upload image and search for similar items
 * @param {File} imageFile - Image file to upload and search
 * @param {string} prompt - Optional text prompt
 * @returns {Promise<Object>} Search results
 */
    async searchByUploadedImage(imageFile, prompt = '') {
        try {
            // Convert image file to base64 or upload to a temporary service
            const imageUrl = await this.uploadImageToTempService(imageFile);

            // Use the uploaded image URL for search
            return await this.searchSimilarClothing(imageUrl, prompt);
        } catch (error) {
            console.error('Image upload search failed:', error);
            return {
                success: false,
                error: 'Failed to process uploaded image',
                results: []
            };
        }
    }

    /**
     * Upload image to temporary service (placeholder - you can integrate with your preferred service)
     * @param {File} imageFile - Image file to upload
     * @returns {Promise<string>} Image URL
     */
    async uploadImageToTempService(imageFile) {
        // For now, create a local object URL (this won't work with external APIs)
        // In production, you'd upload to a service like Cloudinary, AWS S3, etc.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // For demo purposes, we'll use a placeholder
                // In real implementation, upload to cloud storage and return URL
                resolve('https://via.placeholder.com/400x400/000000/ffffff?text=Uploaded+Image');
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    /**
     * Search for similar items on specific fashion websites
     * @param {string} prompt - Search query
     * @returns {Promise<Array>} Search results from fashion sites
     */
    async searchFashionSites(prompt) {
        const fashionSites = [
            'site:amazon.com',
            'site:zara.com',
            'site:hm.com',
            'site:uniqlo.com',
            'site:asos.com',
            'site:nordstrom.com'
        ];

        const searchPromises = fashionSites.map(site => {
            const siteQuery = `${prompt} ${site}`;
            return this.searchByText(siteQuery).catch(error => {
                console.warn(`Search failed for ${site}:`, error);
                return [];
            });
        });

        const results = await Promise.all(searchPromises);
        return results.flat();
    }

    /**
     * Provide mock search results for development/demo purposes
     * @param {string} query - Search query
     * @returns {Array} Mock search results
     */
    getMockSearchResults(query) {
        // Handle undefined or empty query
        const searchTerm = query || 'fashion item';
        const lowerSearchTerm = searchTerm.toLowerCase();

        return [
            {
                title: `${searchTerm} - Premium Collection | Fashion Store`,
                link: 'https://example-fashion-store.com/product/1',
                image: 'https://via.placeholder.com/300x400/000000/FFFFFF?text=Fashion+Item+1',
                snippet: `Discover our premium ${lowerSearchTerm} collection. High-quality materials and modern design.`,
                displayLink: 'example-fashion-store.com',
                price: '$89.99',
                source: 'mock'
            },
            {
                title: `Stylish ${searchTerm} | Designer Brand`,
                link: 'https://designer-brand.com/product/2',
                image: 'https://via.placeholder.com/300x400/333333/FFFFFF?text=Designer+Item',
                snippet: `Elegant ${lowerSearchTerm} perfect for any occasion. Available in multiple sizes and colors.`,
                displayLink: 'designer-brand.com',
                price: '$129.99',
                source: 'mock'
            },
            {
                title: `Affordable ${searchTerm} Collection`,
                link: 'https://budget-fashion.com/product/3',
                image: 'https://via.placeholder.com/300x400/666666/FFFFFF?text=Budget+Fashion',
                snippet: `Quality ${lowerSearchTerm} at unbeatable prices. Free shipping on orders over $50.`,
                displayLink: 'budget-fashion.com',
                price: '$39.99',
                source: 'mock'
            },
            {
                title: `Luxury ${searchTerm} - Exclusive Design`,
                link: 'https://luxury-boutique.com/product/4',
                image: 'https://via.placeholder.com/300x400/999999/000000?text=Luxury+Item',
                snippet: `Exclusive ${lowerSearchTerm} from our luxury collection. Handcrafted with premium materials.`,
                displayLink: 'luxury-boutique.com',
                price: '$299.99',
                source: 'mock'
            }
        ];
    }
}

export default new GoogleLensService();
