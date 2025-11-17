class GoogleLensService {
    constructor() {
        // ScrapingDog API for Google Lens functionality
        this.scrapingDogApiKey = import.meta.env.VITE_SCRAPINGDOG_API_KEY || '68ad90441e87f945fc84bf5f';
        this.scrapingDogBaseUrl = 'https://api.scrapingdog.com/google_lens';

        // Google Custom Search API with your credentials
        this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyDNlPNS_UMqX0_ybLElA2X22WlKa17kaOE';
        this.searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || 'e7c5ff0f989d54294';

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
            console.log('🔧 Development mode detected - using localhost:5000');
            return 'http://localhost:5000';
        }

        // Check for custom backend URL
        if (import.meta.env.VITE_BACKEND_URL) {
            console.log(`🔧 Custom backend URL: ${import.meta.env.VITE_BACKEND_URL}`);
            return import.meta.env.VITE_BACKEND_URL;
        }





        // Production - detect platform
        const hostname = window.location.hostname;
        console.log(`🌐 Detecting platform for hostname: ${hostname}`);

        // Vercel deployment
        if (hostname.includes('vercel.app') || hostname.includes('.vercel.app')) {
            console.log('✅ Vercel deployment detected - using /api');
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
                searchPrompt = sessionStorage.getItem('currentPrompt');
                console.log(`📂 Using saved prompt: "${searchPrompt}"`);
            }

            // Default fallback
            if (!searchPrompt) {
                searchPrompt = 'fashion clothing';
                console.log('🔄 Using default prompt: "fashion clothing"');
            }

            console.log(`🔍 Starting search with prompt: "${searchPrompt}"`);
            console.log(`🔍 Environment check - VITE_GOOGLE_API_KEY: ${import.meta.env.VITE_GOOGLE_API_KEY ? 'SET' : 'NOT SET'}`);
            console.log(`🔍 Environment check - VITE_GOOGLE_SEARCH_ENGINE_ID: ${import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID ? 'SET' : 'NOT SET'}`);

            // Use Google Lens image search if we have an image
            if (imageUrl) {
                console.log('🔍 Using Google Lens image search with image URL:', imageUrl);
                try {
                    const imageResults = await this.searchByImage(imageUrl);

                    if (imageResults && imageResults.length > 0) {
                        console.log(`✅ Google Lens found ${imageResults.length} visual matches`);
                        return {
                            success: true,
                            results: imageResults,
                            searchType: 'google_lens',
                            query: searchPrompt
                        };
                    }
                } catch (imageError) {
                    console.error('❌ Google Lens search failed:', imageError);
                    console.log('🔄 Falling back to text search');
                }
            }

            // Fallback to text search if no image or image search failed
            console.log('📝 Using text-based search');
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
            // ScrapingDog Google Lens API requires the image URL to be passed as a parameter
            const apiUrl = `${this.scrapingDogBaseUrl}`;
            const params = new URLSearchParams({
                api_key: this.scrapingDogApiKey,
                url: imageUrl,
                country: 'us'
            });

            const searchUrl = `${apiUrl}?${params}`;
            console.log('🔍 Making Google Lens search request...');
            console.log('📸 Image URL:', imageUrl);

            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('📡 ScrapingDog Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ ScrapingDog API error:', errorText);
                throw new Error(`ScrapingDog API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Google Lens API response received');
            console.log('📊 Response data:', data);

            return this.formatLensResults(data);
        } catch (error) {
            console.error('❌ Google Lens search failed:', error);
            throw error;
        }
    }

    /**
     * Search using Google Custom Search API with text query
     * @param {string} query - Search query
     * @returns {Promise<Array>} Search results
     */
    async searchByText(query) {
        console.log('📝 Starting text search for:', query);

        try {
            // For now, skip the API call and use direct image URLs
            console.log('🔍 Using direct fashion image URLs...');
            const useDirectImages = true;

            if (useDirectImages) {
                return this.getRealisticFashionProducts(query);
            }

            // Unsplash API code (kept for later)
            const accessKey = 'Qc0Mjp_cTPEHr3sUqvQVjZXHlLVLMqgTiZ4QrNyGnTw';
            const enhancedQuery = `${query} fashion clothing model`;
            const perPage = 20;

            const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(enhancedQuery)}&per_page=${perPage}&client_id=${accessKey}&orientation=portrait`;

            console.log('🔍 Fetching from Unsplash API...');

            const response = await fetch(unsplashUrl);

            if (!response.ok) {
                throw new Error('Unsplash API error');
            }

            const data = await response.json();
            console.log(`✅ Found ${data.results.length} results from Unsplash`);

            // Enhanced product data generation
            const brands = [
                'ZARA', 'H&M', 'Nike', 'Adidas', 'Uniqlo', 'Forever 21', 'Gap', 'Urban Outfitters',
                'Mango', 'COS', 'Massimo Dutti', 'Pull & Bear', 'Bershka', 'Stradivarius',
                'American Eagle', 'Hollister', 'Abercrombie & Fitch', 'Tommy Hilfiger'
            ];

            const productTypes = [
                'Premium Collection', 'Limited Edition', 'Sustainable Line', 'Classic Series',
                'Modern Fit', 'Comfort Collection', 'Designer Collaboration', 'Seasonal Special'
            ];

            // Format Unsplash results to match our format
            const results = data.results.map((photo, index) => {
                const brand = brands[index % brands.length];
                const productType = productTypes[index % productTypes.length];
                const basePrice = Math.floor(Math.random() * 200) + 30; // $30-$230
                const salePrice = Math.random() > 0.6 ? Math.floor(basePrice * 0.7) : basePrice;
                const isOnSale = salePrice < basePrice;

                // Generate product-specific URLs
                const productId = Math.floor(Math.random() * 900000) + 100000;
                const productUrl = `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/product/${productId}`;

                return {
                    id: photo.id,
                    title: `${query} - ${brand} ${productType}`.trim(),
                    link: productUrl,
                    image: photo.urls.regular || photo.urls.full || photo.urls.small,
                    thumbnail: photo.urls.small,
                    snippet: photo.description || `Premium ${query} from ${brand}'s ${productType}. Crafted with attention to detail and modern style. Available in multiple colors and sizes.`,
                    displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                    price: `$${salePrice}.99`,
                    originalPrice: isOnSale ? `$${basePrice}.99` : null,
                    discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                    source: 'unsplash_search',
                    photographer: photo.user.name,
                    photographerUrl: photo.user.links.html,
                    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0 rating
                    reviews: Math.floor(Math.random() * 500) + 50, // 50-550 reviews
                    inStock: Math.random() > 0.2, // 80% in stock
                    freeShipping: basePrice > 50
                };
            });

            return results;

        } catch (error) {
            console.error('❌ Real search failed:', error);
            console.log('🔄 Falling back to enhanced mock data');

            // If API fails, return enhanced mock data
            return this.getEnhancedMockResults(query);
        }
    }

    /**
     * Get enhanced mock results with better variety
     * @param {string} query - Search query
     * @returns {Array} Mock results
     */
    getEnhancedMockResults(query) {
        const brands = [
            'ZARA', 'H&M', 'Nike', 'Adidas', 'Uniqlo', 'Forever 21', 'Gap', 'Urban Outfitters',
            'Mango', 'COS', 'Massimo Dutti', 'Pull & Bear', 'Bershka', 'Stradivarius',
            'American Eagle', 'Hollister', 'Abercrombie & Fitch', 'Tommy Hilfiger',
            'Ralph Lauren', 'Calvin Klein'
        ];

        const productTypes = [
            'Premium Collection', 'Limited Edition', 'Sustainable Line', 'Classic Series',
            'Modern Fit', 'Comfort Collection', 'Designer Collaboration', 'Seasonal Special'
        ];

        // Generate 20 mock products
        const fashionItems = [];
        for (let i = 0; i < 20; i++) {
            const brand = brands[i % brands.length];
            const productType = productTypes[i % productTypes.length];
            const basePrice = Math.floor(Math.random() * 200) + 30;
            const salePrice = Math.random() > 0.6 ? Math.floor(basePrice * 0.7) : basePrice;
            const isOnSale = salePrice < basePrice;
            const productId = Math.floor(Math.random() * 900000) + 100000;

            fashionItems.push({
                id: `mock-${i}`,
                title: `${query} - ${brand} ${productType}`.trim(),
                link: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/product/${productId}`,
                image: `https://source.unsplash.com/400x600/?${encodeURIComponent(query + ' fashion')}&sig=${i}`,
                thumbnail: `https://source.unsplash.com/200x300/?${encodeURIComponent(query + ' fashion')}&sig=${i}`,
                snippet: `Premium ${query} from ${brand}'s ${productType}. Crafted with attention to detail and modern style. Available in multiple colors and sizes.`,
                displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                price: `$${salePrice}.99`,
                originalPrice: isOnSale ? `$${basePrice}.99` : null,
                discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                source: 'mock_enhanced',
                rating: (Math.random() * 2 + 3).toFixed(1),
                reviews: Math.floor(Math.random() * 500) + 50,
                inStock: Math.random() > 0.2,
                freeShipping: basePrice > 50
            });
        }

        return fashionItems;
    }

    /**
     * Get realistic fashion products with working images
     * @param {string} query - Search query
     * @returns {Array} Fashion products
     */
    getRealisticFashionProducts(query) {
        const queryLower = query.toLowerCase();

        // Category-specific images based on search query
        const imageCategories = {
            'suit': [
                'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=600', // Man in suit
                'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600', // Business suit
                'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600', // Woman suit
                'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600', // Gray suit
                'https://images.pexels.com/photos/2897521/pexels-photo-2897521.jpeg?auto=compress&cs=tinysrgb&w=600', // Navy suit
                'https://images.pexels.com/photos/1702429/pexels-photo-1702429.jpeg?auto=compress&cs=tinysrgb&w=600', // Black suit
                'https://images.pexels.com/photos/2254621/pexels-photo-2254621.jpeg?auto=compress&cs=tinysrgb&w=600', // Formal suit
                'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=600', // Professional
                'https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg?auto=compress&cs=tinysrgb&w=600', // Business woman
                'https://images.pexels.com/photos/4937449/pexels-photo-4937449.jpeg?auto=compress&cs=tinysrgb&w=600', // Modern suit
                'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600', // Suit jacket
                'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600', // Business casual
                'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600', // Suit pants
                'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600', // Blue suit
                'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=600', // Pinstripe
                'https://images.pexels.com/photos/936564/pexels-photo-936564.jpeg?auto=compress&cs=tinysrgb&w=600', // Classic suit
                'https://images.pexels.com/photos/1321943/pexels-photo-1321943.jpeg?auto=compress&cs=tinysrgb&w=600', // Vest suit
                'https://images.pexels.com/photos/450214/pexels-photo-450214.jpeg?auto=compress&cs=tinysrgb&w=600', // Tie and suit
                'https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg?auto=compress&cs=tinysrgb&w=600', // Business attire
                'https://images.pexels.com/photos/4342400/pexels-photo-4342400.jpeg?auto=compress&cs=tinysrgb&w=600' // Luxury suit
            ],
            'dress': [
                'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/904117/pexels-photo-904117.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1926047/pexels-photo-1926047.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1163194/pexels-photo-1163194.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1488517/pexels-photo-1488517.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1775862/pexels-photo-1775862.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            'default': [
                'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/983564/pexels-photo-983564.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/984950/pexels-photo-984950.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/923210/pexels-photo-923210.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1144834/pexels-photo-1144834.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=600'
            ]
        };

        // Select appropriate images based on query
        let fashionImages;
        if (queryLower.includes('suit') || queryLower.includes('business') || queryLower.includes('formal')) {
            fashionImages = imageCategories.suit;
        } else if (queryLower.includes('dress') || queryLower.includes('gown') || queryLower.includes('evening')) {
            fashionImages = imageCategories.dress;
        } else {
            fashionImages = imageCategories.default;
        }

        // Generate products specific to the query type
        if (queryLower.includes('suit') || queryLower.includes('business')) {
            return this.getBusinessSuitProducts(query, fashionImages);
        } else if (queryLower.includes('dress')) {
            return this.getDressProducts(query, fashionImages);
        } else if (queryLower.includes('street') || queryLower.includes('streetwear') || queryLower.includes('casual')) {
            return this.getStreetwearProducts(query, fashionImages);
        } else {
            return this.getGeneralFashionProducts(query, fashionImages);
        }
    }

    getBusinessSuitProducts(query, images) {
        const suitBrands = [
            'Hugo Boss', 'Brooks Brothers', 'Armani', 'Ralph Lauren', 'Tom Ford',
            'Burberry', 'Gucci', 'Prada', 'Versace', 'Canali',
            'Zegna', 'Paul Smith', 'Ted Baker', 'Calvin Klein', 'DKNY',
            'Michael Kors', 'Theory', 'Banana Republic', 'J.Crew', 'Nordstrom'
        ];

        const suitTypes = [
            'Classic Two-Piece Suit', 'Three-Piece Suit', 'Slim Fit Suit', 'Modern Fit Suit',
            'Double-Breasted Suit', 'Pinstripe Suit', 'Wool Suit', 'Linen Summer Suit',
            'Tuxedo', 'Business Blazer', 'Suit Jacket', 'Dress Pants',
            'Executive Collection', 'Premium Wool Suit', 'Italian Cut Suit', 'British Tailoring',
            'Wedding Suit', 'Interview Suit', 'Power Suit', 'Designer Suit'
        ];

        const products = [];
        for (let i = 0; i < 20; i++) {
            const brand = suitBrands[i % suitBrands.length];
            const type = suitTypes[i % suitTypes.length];
            const basePrice = Math.floor(Math.random() * 800) + 200; // $200-$1000
            const salePrice = Math.random() > 0.5 ? Math.floor(basePrice * 0.8) : basePrice;
            const isOnSale = salePrice < basePrice;

            products.push({
                id: `suit-${i}`,
                title: `${brand} - ${type}`,
                link: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/suit/${i}`,
                image: images[i],
                displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                price: `$${salePrice}.00`,
                originalPrice: isOnSale ? `$${basePrice}.00` : null,
                discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                snippet: `Premium ${type} from ${brand}. Expertly tailored for the modern professional. Available in classic colors.`,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 300) + 50,
                inStock: Math.random() > 0.1,
                freeShipping: basePrice > 300,
                source: 'realistic_fashion'
            });
        }
        return products;
    }

    getDressProducts(query, images) {
        const dressBrands = [
            'Reformation', 'Zimmermann', 'Self-Portrait', 'Alice + Olivia', 'Diane von Furstenberg',
            'Free People', 'Anthropologie', 'Revolve', 'ASOS Design', 'Nordstrom',
            'Ted Baker', 'Karen Millen', 'Reiss', 'Phase Eight', 'Whistles',
            'Boden', 'COS', '& Other Stories', 'Mango', 'Massimo Dutti'
        ];

        const dressTypes = [
            'Cocktail Dress', 'Maxi Dress', 'Midi Dress', 'Mini Dress', 'Evening Gown',
            'Wrap Dress', 'Bodycon Dress', 'A-Line Dress', 'Shift Dress', 'Sheath Dress',
            'Fit & Flare', 'Halter Dress', 'Off-Shoulder Dress', 'Slip Dress', 'Shirt Dress',
            'Sweater Dress', 'Lace Dress', 'Floral Dress', 'Little Black Dress', 'Wedding Guest Dress'
        ];

        const products = [];
        for (let i = 0; i < 20; i++) {
            const brand = dressBrands[i % dressBrands.length];
            const type = dressTypes[i % dressTypes.length];
            const basePrice = Math.floor(Math.random() * 300) + 50; // $50-$350
            const salePrice = Math.random() > 0.6 ? Math.floor(basePrice * 0.7) : basePrice;
            const isOnSale = salePrice < basePrice;

            products.push({
                id: `dress-${i}`,
                title: `${brand} - ${type}`,
                link: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/dress/${i}`,
                image: images[i],
                displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                price: `$${salePrice}.00`,
                originalPrice: isOnSale ? `$${basePrice}.00` : null,
                discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                snippet: `Beautiful ${type} from ${brand}. Perfect for special occasions and everyday elegance. Available in various sizes.`,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 400) + 100,
                inStock: Math.random() > 0.15,
                freeShipping: basePrice > 100,
                source: 'realistic_fashion'
            });
        }
        return products;
    }

    getStreetwearProducts(query, images) {
        const streetBrands = [
            'Supreme', 'Off-White', 'Palace', 'BAPE', 'Stussy',
            'Nike', 'Adidas', 'Champion', 'The North Face', 'Carhartt',
            'Vans', 'Converse', 'New Balance', 'ASICS', 'Reebok',
            'HUF', 'Obey', 'Billionaire Boys Club', 'Kith', 'Fear of God'
        ];

        const streetTypes = [
            'Graphic Hoodie', 'Oversized T-Shirt', 'Track Pants', 'Cargo Pants', 'Bomber Jacket',
            'Denim Jacket', 'Sneakers', 'Bucket Hat', 'Crossbody Bag', 'Windbreaker',
            'Joggers', 'Crew Neck', 'Basketball Shorts', 'Skate Shoes', 'Dad Cap',
            'Pullover', 'Track Jacket', 'Utility Vest', 'Logo Tee', 'Sweat Shorts'
        ];

        const products = [];
        for (let i = 0; i < 20; i++) {
            const brand = streetBrands[i % streetBrands.length];
            const type = streetTypes[i % streetTypes.length];
            const basePrice = Math.floor(Math.random() * 200) + 40; // $40-$240
            const salePrice = Math.random() > 0.7 ? Math.floor(basePrice * 0.85) : basePrice;
            const isOnSale = salePrice < basePrice;

            products.push({
                id: `street-${i}`,
                title: `${brand} - ${type}`,
                link: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/streetwear/${i}`,
                image: images[i],
                displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                price: `$${salePrice}.00`,
                originalPrice: isOnSale ? `$${basePrice}.00` : null,
                discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                snippet: `Fresh ${type} from ${brand}. Street-ready style with authentic urban aesthetic. Limited availability.`,
                rating: (Math.random() * 1 + 4).toFixed(1),
                reviews: Math.floor(Math.random() * 600) + 200,
                inStock: Math.random() > 0.2,
                freeShipping: basePrice > 75,
                source: 'realistic_fashion'
            });
        }
        return products;
    }

    getGeneralFashionProducts(query, images) {
        const generalBrands = [
            'ZARA', 'H&M', 'Uniqlo', 'Gap', 'Old Navy',
            'Forever 21', 'Urban Outfitters', 'American Eagle', 'Abercrombie & Fitch', 'Hollister',
            'Target', 'Walmart', 'Macy\'s', 'JCPenney', 'Kohl\'s',
            'Express', 'Ann Taylor', 'Loft', 'J.Crew', 'Banana Republic'
        ];

        const products = [];
        for (let i = 0; i < 20; i++) {
            const brand = generalBrands[i % generalBrands.length];
            const basePrice = Math.floor(Math.random() * 150) + 20; // $20-$170
            const salePrice = Math.random() > 0.5 ? Math.floor(basePrice * 0.75) : basePrice;
            const isOnSale = salePrice < basePrice;

            products.push({
                id: `fashion-${i}`,
                title: `${query} - ${brand} Collection`,
                link: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.com/product/${i}`,
                image: images[i],
                displayLink: `${brand.toLowerCase().replace(/\s+/g, '')}.com`,
                price: `$${salePrice}.99`,
                originalPrice: isOnSale ? `$${basePrice}.99` : null,
                discount: isOnSale ? `${Math.round((1 - salePrice / basePrice) * 100)}% OFF` : null,
                snippet: `Stylish ${query} from ${brand}. Quality materials and contemporary design. Multiple colors available.`,
                rating: (Math.random() * 2 + 3).toFixed(1),
                reviews: Math.floor(Math.random() * 500) + 50,
                inStock: Math.random() > 0.1,
                freeShipping: basePrice > 50,
                source: 'realistic_fashion'
            });
        }
        return products;
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
            link: item.context || item.link || '#', // Website URL
            image: item.image || item.link || 'https://via.placeholder.com/300x400/cccccc/ffffff?text=Fashion+Item', // Image URL
            snippet: item.snippet || item.title || 'Fashion item found via Google Custom Search',
            displayLink: this.extractDomain(item.context || item.displayLink),
            price: this.extractPrice(item.snippet || item.title || ''),
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

        // Generate 20 mock results for better demo
        const mockResults = [];
        const stores = [
            { name: 'Fashion Store', domain: 'example-fashion-store.com', price: '$89.99' },
            { name: 'Designer Brand', domain: 'designer-brand.com', price: '$129.99' },
            { name: 'Budget Fashion', domain: 'budget-fashion.com', price: '$39.99' },
            { name: 'Luxury Boutique', domain: 'luxury-boutique.com', price: '$299.99' },
            { name: 'Style Hub', domain: 'stylehub.com', price: '$79.99' },
            { name: 'Trendy Wear', domain: 'trendywear.com', price: '$59.99' },
            { name: 'Fashion Forward', domain: 'fashionforward.com', price: '$149.99' },
            { name: 'Chic Collection', domain: 'chiccollection.com', price: '$199.99' },
            { name: 'Urban Style', domain: 'urbanstyle.com', price: '$69.99' },
            { name: 'Elite Fashion', domain: 'elitefashion.com', price: '$249.99' }
        ];

        const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'F39C12', '8E44AD', '2ECC71', 'E74C3C'];

        for (let i = 0; i < 20; i++) {
            const store = stores[i % stores.length];
            const color = colors[i % colors.length];

            mockResults.push({
                title: `${searchTerm} - ${store.name} Collection ${i + 1}`,
                link: `https://${store.domain}/product/${i + 1}`,
                image: `https://via.placeholder.com/300x400/${color}/FFFFFF?text=${encodeURIComponent(searchTerm)}+${i + 1}`,
                snippet: `Premium ${lowerSearchTerm} from ${store.name}. High-quality materials and modern design. Available in multiple sizes.`,
                displayLink: store.domain,
                price: store.price,
                source: 'mock'
            });
        }

        return mockResults;
    }
}

export default new GoogleLensService();
