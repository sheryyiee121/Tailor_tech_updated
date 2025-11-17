// Admin Configuration
// Add admin email addresses here
export const ADMIN_EMAILS = [
    'jeeu7786@gmail.com',
    // Add more admin emails below
    // Example: 'youremail@gmail.com',
];

// Check if a user is an admin
export const isAdmin = (userEmail) => {
    if (!userEmail) return false;
    console.log('Checking admin status for:', userEmail);
    console.log('Admin emails:', ADMIN_EMAILS);
    const isAdminUser = ADMIN_EMAILS.some(email =>
        email.toLowerCase() === userEmail.toLowerCase()
    );
    console.log('Is admin?', isAdminUser);
    return isAdminUser;
};

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Check if backend is available
export const isBackendAvailable = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            method: 'GET',
            mode: 'no-cors' // Avoid CORS issues during check
        });
        return true;
    } catch (error) {
        return false;
    }
};

