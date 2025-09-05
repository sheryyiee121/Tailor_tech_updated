import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const result = await signOutUser();
        if (result.success) {
            navigate('/');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-4">
            {/* User Avatar and Info */}
            <div className="flex items-center space-x-3">
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                ) : (
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-sm font-bold">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                        {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
            </div>

            {/* Sign Out Button - Hidden on mobile */}
            <button
                onClick={handleSignOut}
                className="hidden lg:block w-full px-3 py-2 text-sm text-white hover:text-black hover:bg-white rounded-lg transition-all duration-300 font-medium border border-white/20 hover:border-white"
            >
                Sign Out
            </button>
        </div>
    );
};

export default UserProfile;
