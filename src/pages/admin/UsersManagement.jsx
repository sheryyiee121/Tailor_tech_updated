import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Search, Mail, Ban, CheckCircle, ArrowLeft, Download } from 'lucide-react';
import { isAdmin, API_BASE_URL } from '../../config/adminConfig';

const UsersManagement = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !isAdmin(user.email)) {
            navigate('/dashboard');
            return;
        }
        if (user && isAdmin(user.email)) {
            fetchUsers();
        }
    }, [user, navigate]);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, filterStatus, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            console.log('Fetching users from:', `${API_BASE_URL}/admin/users`);
            const response = await fetch(`${API_BASE_URL}/admin/users`);
            console.log('Users response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Users data received:', data.length, 'users');
                setUsers(data);
            } else {
                const errorText = await response.text();
                console.error('Backend error:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(u =>
                filterStatus === 'blocked' ? u.isBlocked : !u.isBlocked
            );
        }

        setFilteredUsers(filtered);
    };

    const toggleBlockUser = async (userId, currentStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Email', 'Display Name', 'Status', 'Created At'],
            ...filteredUsers.map(u => [
                u.email,
                u.displayName || 'N/A',
                u.isBlocked ? 'Blocked' : 'Active',
                new Date(u.createdAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (!user || !isAdmin(user.email)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                            <p className="text-gray-600 mt-1">Manage all registered users</p>
                        </div>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active Users</option>
                            <option value="blocked">Blocked Users</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            No users found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {u.photoURL ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={u.photoURL}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                                                {(u.displayName || u.email).charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {u.displayName || 'No name'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {u.uid.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isBlocked
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {u.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => toggleBlockUser(u.id, u.isBlocked)}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${u.isBlocked
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {u.isBlocked ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Unblock
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="w-4 h-4" />
                                                            Block
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            <p className="text-sm text-gray-600">Total Users</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {users.filter(u => !u.isBlocked).length}
                            </p>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">
                                {users.filter(u => u.isBlocked).length}
                            </p>
                            <p className="text-sm text-gray-600">Blocked Users</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;

