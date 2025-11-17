import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Users, ShoppingBag, BarChart3, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { isAdmin, API_BASE_URL } from '../../config/adminConfig';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuthContext();
    const { signOutUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        blockedUsers: 0
    });

    useEffect(() => {
        // Check if user is admin
        if (user && !isAdmin(user.email)) {
            navigate('/dashboard');
            return;
        }

        // Fetch stats from backend only if user is admin
        if (user && isAdmin(user.email)) {
            fetchStats();
        }
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            console.log('Fetching stats from:', `${API_BASE_URL}/admin/stats`);
            const response = await fetch(`${API_BASE_URL}/admin/stats`);
            console.log('Stats response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Stats data received:', data);
                setStats(data);
            } else {
                const errorText = await response.text();
                console.error('Backend error:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!user || !isAdmin(user.email)) {
        return null;
    }

    const cards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            link: '/admin/users'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-green-500',
            link: '/admin/orders'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: BarChart3,
            color: 'bg-yellow-500',
            link: '/admin/orders?status=pending'
        },
        {
            title: 'Blocked Users',
            value: stats.blockedUsers,
            icon: Settings,
            color: 'bg-red-500',
            link: '/admin/users?status=blocked'
        }
    ];

    const handleLogout = async () => {
        await signOutUser();
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || user?.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                onClick={() => navigate(card.link)}
                                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            <Users className="w-8 h-8 text-blue-500 mb-2" />
                            <h3 className="font-semibold text-gray-900">Manage Users</h3>
                            <p className="text-sm text-gray-600">View and manage all users</p>
                        </button>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                        >
                            <ShoppingBag className="w-8 h-8 text-green-500 mb-2" />
                            <h3 className="font-semibold text-gray-900">View Orders</h3>
                            <p className="text-sm text-gray-600">Check all custom design orders</p>
                        </button>
                        <button
                            onClick={() => navigate('/admin/analytics')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                            <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                            <h3 className="font-semibold text-gray-900">Analytics</h3>
                            <p className="text-sm text-gray-600">View user behavior insights</p>
                        </button>
                        <button
                            onClick={() => navigate('/admin/settings')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                        >
                            <Settings className="w-8 h-8 text-orange-500 mb-2" />
                            <h3 className="font-semibold text-gray-900">Settings</h3>
                            <p className="text-sm text-gray-600">Configure admin settings</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

