import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ExternalLink, Star, DollarSign, Package, Truck, Heart, Filter, Grid, List, ChevronLeft } from 'lucide-react';
import googleLensService from '../../services/googleLensService';

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { prompt, generatedImage, modelData } = location.state || {};

    useEffect(() => {
        // Always perform search, even if prompt is undefined
        performSearch();
    }, [prompt]);

    const performSearch = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use saved prompt if none provided
            let searchPrompt = prompt;
            if (!searchPrompt) {
                // Try to get from sessionStorage
                searchPrompt = sessionStorage.getItem('currentPrompt');
                console.log(`📂 Using saved prompt for search: "${searchPrompt}"`);
            }
            if (!searchPrompt) {
                searchPrompt = 'fashion clothing';
                console.log('🔄 Using default prompt: "fashion clothing"');
            }

            const results = await googleLensService.searchSimilarClothing(generatedImage, searchPrompt);

            if (results.success) {
                setSearchResults(results.results);
            } else {
                setError(results.error || 'Search failed');
            }
        } catch (err) {
            setError('Failed to search for similar items');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomOrder = () => {
        navigate('/custom-order', {
            state: {
                prompt,
                generatedImage,
                modelData,
                searchResults: searchResults.length === 0
            }
        });
    };

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );

    const SearchResultCard = ({ result, index }) => {
        const [isLiked, setIsLiked] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
            >
                {/* Sale Badge */}
                {result.discount && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {result.discount}
                    </div>
                )}

                {/* Like Button */}
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>

                {/* Product Image */}
                <div className="relative overflow-hidden h-80">
                    <img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            console.log('Image failed to load:', result.image);
                            e.target.src = `https://source.unsplash.com/400x600/?fashion,clothing&sig=${index}`;
                        }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute bottom-4 left-4 right-4">
                            <button
                                onClick={() => window.open(result.link, '_blank')}
                                className="w-full bg-white text-black py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Quick Shop
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                    {/* Brand & Title */}
                    <div>
                        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            {result.displayLink}
                        </p>
                        <h3 className="text-white font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
                            {result.title}
                        </h3>
                    </div>

                    {/* Rating */}
                    {result.rating && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(result.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-400 text-xs">
                                {result.rating} ({result.reviews} reviews)
                            </span>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xl">
                                {result.price}
                            </span>
                            {result.originalPrice && (
                                <span className="text-gray-500 text-sm line-through">
                                    {result.originalPrice}
                                </span>
                            )}
                        </div>
                        {result.inStock !== undefined && (
                            result.inStock ? (
                                <span className="text-green-400 text-xs font-medium">In Stock</span>
                            ) : (
                                <span className="text-red-400 text-xs font-medium">Out of Stock</span>
                            )
                        )}
                    </div>

                    {/* Free Shipping Badge */}
                    {result.freeShipping && (
                        <div className="flex items-center gap-1 text-blue-400 text-xs">
                            <Truck className="w-4 h-4" />
                            <span>Free Shipping</span>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={() => window.open(result.link, '_blank')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Details
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-b from-purple-900/20 via-black to-black border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to Animation</span>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                            Search Results
                        </h1>
                        <p className="text-gray-300 text-lg mb-6">
                            Found similar items for: <span className="text-white font-semibold">"{prompt || sessionStorage.getItem('currentPrompt') || 'fashion clothing'}"</span>
                        </p>

                        {searchResults.length > 0 && searchResults[0].source === 'google_lens' && (
                            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-4 inline-flex items-center">
                                <Search className="w-4 h-4 text-blue-400 mr-2" />
                                <span className="text-blue-300 text-sm font-medium">Powered by Google Lens Image Search</span>
                            </div>
                        )}

                        {searchResults.length > 0 && searchResults[0].source === 'unsplash_search' && (
                            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4 inline-flex items-center">
                                <Search className="w-4 h-4 text-green-400 mr-2" />
                                <span className="text-green-300 text-sm font-medium">Real Fashion Images from Unsplash</span>
                            </div>
                        )}

                        {searchResults.length > 0 && searchResults[0].source === 'realistic_fashion' && (
                            <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 mb-4 inline-flex items-center">
                                <ShoppingBag className="w-4 h-4 text-purple-400 mr-2" />
                                <span className="text-purple-300 text-sm font-medium">Real Products from Top Fashion Brands</span>
                            </div>
                        )}

                        {generatedImage && (
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <img
                                        src={generatedImage}
                                        alt="Generated Design"
                                        className="w-32 h-32 object-cover rounded-xl border-2 border-white/20"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                                        <Star className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading && <LoadingSkeleton />}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-8 max-w-md mx-auto">
                            <Search className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-red-300 mb-2">Search Failed</h3>
                            <p className="text-red-200 mb-4">{error}</p>
                            <button
                                onClick={performSearch}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && searchResults.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md mx-auto">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Similar Items Found</h3>
                            <p className="text-gray-300 mb-6">
                                We couldn't find any similar items online. Would you like to place a custom order?
                            </p>
                            <button
                                onClick={handleCustomOrder}
                                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                            >
                                Place Custom Order
                            </button>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && searchResults.length > 0 && (
                    <>
                        {/* Filters and Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-bold text-white">
                                        {searchResults.length} Products Found
                                    </h2>
                                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-sm">
                                        <Filter className="w-4 h-4" />
                                        <span>Filters</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm">
                                        <option>Sort by: Best Match</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Customer Rating</option>
                                        <option>Newest Arrivals</option>
                                    </select>

                                    <button
                                        onClick={handleCustomOrder}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                                    >
                                        <Package className="w-4 h-4" />
                                        <span className="hidden sm:inline">Custom Order</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Grid - Updated for 20 products */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                        >
                            {searchResults.map((result, index) => (
                                <SearchResultCard key={result.id || index} result={result} index={index} />
                            ))}
                        </motion.div>

                        {/* Load More Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-center mt-12"
                        >
                            <p className="text-gray-400 mb-4">Showing {searchResults.length} of {searchResults.length} products</p>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 hover:border-white/40">
                                View More Fashion Items
                            </button>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
