import { API_BASE_URL } from '../config/adminConfig';

/**
 * Sync Firebase user with backend database
 * Call this after user signs in
 */
export const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) {
        console.log('No user to sync');
        return;
    }

    try {
        const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
        };

        console.log('🔄 Syncing user to backend:', userData.email);
        console.log('API URL:', `${API_BASE_URL}/users`);

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        console.log('Sync response status:', response.status);

        if (response.ok) {
            const syncedUser = await response.json();
            console.log('✅ User synced with backend successfully:', syncedUser);
            return syncedUser;
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to sync user:', response.status, errorText);
        }
    } catch (error) {
        console.error('❌ Error syncing user with backend:', error);
        throw error;
    }
};

/**
 * Check if user is blocked
 */
export const checkUserStatus = async (uid) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/uid/${uid}`);

        if (response.ok) {
            const user = await response.json();
            return {
                isBlocked: user.isBlocked,
                user: user,
            };
        }
    } catch (error) {
        console.error('Error checking user status:', error);
    }

    return { isBlocked: false, user: null };
};

