import { API_BASE_URL } from '../config/adminConfig';

/**
 * Track user activities
 */
export const trackActivity = async (userId, activityType, data = {}) => {
    if (!userId) return;

    try {
        const activity = {
            userId,
            activityType,
            prompt: data.prompt || null,
            mannequinGender: data.mannequinGender || null,
            mannequinSize: data.mannequinSize || null,
            textureUrl: data.textureUrl || null,
            generatedImageUrl: data.generatedImageUrl || null,
            measurements: data.measurements || null,
            additionalData: data.additionalData || null,
        };

        const response = await fetch(`${API_BASE_URL}/useractivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        });

        if (response.ok) {
            console.log('Activity tracked:', activityType);
        }
    } catch (error) {
        console.log('Activity tracking failed (non-critical):', error.message);
    }
};

/**
 * Track prompt usage
 */
export const trackPrompt = async (userId, prompt, generatedImageUrl = null) => {
    if (!userId || !prompt) return;

    try {
        const promptData = {
            userId,
            prompt,
            generatedImageUrl,
        };

        const response = await fetch(`${API_BASE_URL}/prompthistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promptData),
        });

        if (response.ok) {
            console.log('Prompt tracked:', prompt);
        }
    } catch (error) {
        console.log('Prompt tracking failed (non-critical):', error.message);
    }
};

/**
 * Track mannequin selection
 */
export const trackMannequinSelection = async (userId, selectionData) => {
    if (!userId) return;

    try {
        const mannequinData = {
            userId,
            gender: selectionData.gender,
            size: selectionData.size,
            customMeasurements: selectionData.customMeasurements || null,
            associatedPrompt: selectionData.prompt || null,
            textureApplied: selectionData.texture || null,
            finalImageUrl: selectionData.finalImage || null,
            isCustomMannequin: selectionData.isCustom || false,
        };

        const response = await fetch(`${API_BASE_URL}/mannequin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mannequinData),
        });

        if (response.ok) {
            console.log('Mannequin selection tracked');
        }
    } catch (error) {
        console.log('Mannequin tracking failed (non-critical):', error.message);
    }
};

/**
 * Get user's recent activities
 */
export const getUserActivities = async (userId, limit = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/useractivity/recent/${userId}?limit=${limit}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching user activities:', error);
    }
    return [];
};

/**
 * Get user's prompt history
 */
export const getUserPromptHistory = async (userId, limit = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/prompthistory/recent/${userId}?limit=${limit}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching prompt history:', error);
    }
    return [];
};

/**
 * Get user analytics
 */
export const getUserAnalytics = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/user/${userId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching user analytics:', error);
    }
    return null;
};

