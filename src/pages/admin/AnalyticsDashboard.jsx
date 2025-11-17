import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ArrowLeft, TrendingUp, Users, Zap, ShoppingBag } from 'lucide-react';
import { isAdmin, API_BASE_URL } from '../../config/adminConfig';

const AnalyticsDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !isAdmin(user.email)) {
            navigate('/dashboard');
            return;
        }
        if (user && isAdmin(user.email)) {
            fetchAnalytics();
        }
    }, [user, navigate]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            console.log('Fetching analytics from:', `${API_BASE_URL}/analytics/admin/overview`);
            const response = await fetch(`${API_BASE_URL}/analytics/admin/overview`);
            console.log('Analytics response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Analytics data:', data);
                setAnalytics(data);
            } else {
                const errorText = await response.text();
                console.error('Analytics API error:', response.status, errorText);
            }
        } catch (error) {
            console.error('Analytics fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !isAdmin(user.email)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">User behavior and platform insights</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading analytics...</p>
                    </div>
                ) : analytics ? (
                    <div className="space-y-6">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                                    </div>
                                    <Users className="w-10 h-10 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Prompts</p>
                                        <p className="text-3xl font-bold text-gray-900">{analytics.totalPrompts}</p>
                                    </div>
                                    <Zap className="w-10 h-10 text-yellow-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Mannequin Selections</p>
                                        <p className="text-3xl font-bold text-gray-900">{analytics.totalMannequinSelections}</p>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Orders</p>
                                        <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
                                    </div>
                                    <ShoppingBag className="w-10 h-10 text-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Engagement Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Prompts per User</span>
                                        <span className="font-semibold">{analytics.averagePromptsPerUser?.toFixed(2) || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Orders per User</span>
                                        <span className="font-semibold">{analytics.averageOrdersPerUser?.toFixed(2) || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Activities</span>
                                        <span className="font-semibold">{analytics.totalActivities}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Preferences</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Gender Distribution</p>
                                        <div className="space-y-2">
                                            {analytics.genderDistribution?.map((item) => (
                                                <div key={item.gender} className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${(item.count / analytics.totalMannequinSelections) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium w-20">{item.gender}: {item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Size Distribution</p>
                                        <div className="space-y-2">
                                            {analytics.sizeDistribution?.map((item) => (
                                                <div key={item.size} className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${(item.count / analytics.totalMannequinSelections) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium w-20">{item.size}: {item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Prompts */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Most Used Prompts</h3>
                            <div className="space-y-2">
                                {analytics.topPrompts?.length > 0 ? (
                                    analytics.topPrompts.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                                <span className="text-gray-900">{item.prompt}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {item.usageCount} uses
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No prompt data yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-600">
                        No analytics data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

