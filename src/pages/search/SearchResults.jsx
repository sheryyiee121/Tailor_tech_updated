import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ExternalLink, Star, DollarSign, Package } from 'lucide-react';
import googleLensService from '../../services/googleLensService';
import promptStorageService from '../../services/promptStorageService';

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
                searchPrompt = promptStorageService.getCurrentPrompt();
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

    const SearchResultCard = ({ result, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
            <div className="relative group">
                <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
                <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                    <ExternalLink className="w-4 h-4 text-white" />
                </div>
            </div>

            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                {result.title}
            </h3>

            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                {result.snippet}
            </p>

            <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs">{result.displayLink}</span>
                {result.price && (
                    <span className="text-green-400 font-semibold text-sm flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {result.price}
                    </span>
                )}
            </div>

            <button
                onClick={() => window.open(result.link, '_blank')}
                className="w-full bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
            >
                <ShoppingBag className="w-4 h-4 mr-2" />
                View Product
            </button>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Search Results
                        </h1>
                        <p className="text-gray-300 text-lg mb-6">
                            Found similar items for: <span className="text-white font-semibold">"{prompt || promptStorageService.getCurrentPrompt() || 'fashion clothing'}"</span>
                        </p>

                        {searchResults.length > 0 && searchResults[0].source === 'google_lens' && (
                            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-4 inline-flex items-center">
                                <Search className="w-4 h-4 text-blue-400 mr-2" />
                                <span className="text-blue-300 text-sm font-medium">Powered by Google Lens Image Search</span>
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">
                                    Found {searchResults.length} Similar Items
                                </h2>
                                <button
                                    onClick={handleCustomOrder}
                                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center"
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Custom Order Instead
                                </button>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((result, index) => (
                                <SearchResultCard key={index} result={result} index={index} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
