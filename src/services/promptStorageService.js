/**
 * Runtime Prompt Storage Service
 * Saves user search prompts during the session for easy access
 */

class PromptStorageService {
    constructor() {
        // Runtime storage - resets on page refresh
        this.currentPrompt = null;
        this.promptHistory = [];
        this.maxHistorySize = 10;

        // Session storage for persistence across page navigation
        this.storageKey = 'tailortech_search_prompts';

        // Load existing prompts from session storage
        this.loadFromSession();
    }

    /**
     * Save a new search prompt
     * @param {string} prompt - The user's search prompt (e.g., "red leather jacket")
     */
    savePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') return;

        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        // Update current prompt
        this.currentPrompt = trimmedPrompt;

        // Add to history (avoid duplicates)
        if (!this.promptHistory.includes(trimmedPrompt)) {
            this.promptHistory.unshift(trimmedPrompt);

            // Keep only the most recent prompts
            if (this.promptHistory.length > this.maxHistorySize) {
                this.promptHistory = this.promptHistory.slice(0, this.maxHistorySize);
            }
        }

        // Save to session storage
        this.saveToSession();

        console.log(`✅ Prompt saved: "${trimmedPrompt}"`);
        return trimmedPrompt;
    }

    /**
     * Get the current active prompt
     * @returns {string|null} The current prompt
     */
    getCurrentPrompt() {
        return this.currentPrompt;
    }

    /**
     * Get all prompt history
     * @returns {string[]} Array of previous prompts
     */
    getPromptHistory() {
        return [...this.promptHistory];
    }

    /**
     * Get the most recent prompts (default: 5)
     * @param {number} count - Number of recent prompts to return
     * @returns {string[]} Array of recent prompts
     */
    getRecentPrompts(count = 5) {
        return this.promptHistory.slice(0, count);
    }

    /**
     * Clear current prompt
     */
    clearCurrentPrompt() {
        this.currentPrompt = null;
        this.saveToSession();
    }

    /**
     * Clear all prompts
     */
    clearAllPrompts() {
        this.currentPrompt = null;
        this.promptHistory = [];
        this.saveToSession();
        console.log('🗑️ All prompts cleared');
    }

    /**
     * Search for prompts containing specific text
     * @param {string} searchTerm - Text to search for
     * @returns {string[]} Matching prompts
     */
    searchPrompts(searchTerm) {
        if (!searchTerm) return this.promptHistory;

        const term = searchTerm.toLowerCase();
        return this.promptHistory.filter(prompt =>
            prompt.toLowerCase().includes(term)
        );
    }

    /**
     * Get prompt statistics
     * @returns {object} Statistics about saved prompts
     */
    getStats() {
        return {
            currentPrompt: this.currentPrompt,
            totalPrompts: this.promptHistory.length,
            recentPrompts: this.getRecentPrompts(3),
            allPrompts: this.promptHistory
        };
    }

    /**
     * Save prompts to session storage
     * @private
     */
    saveToSession() {
        try {
            const data = {
                currentPrompt: this.currentPrompt,
                promptHistory: this.promptHistory,
                timestamp: Date.now()
            };
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save prompts to session storage:', error);
        }
    }

    /**
     * Load prompts from session storage
     * @private
     */
    loadFromSession() {
        try {
            const data = sessionStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.currentPrompt = parsed.currentPrompt || null;
                this.promptHistory = parsed.promptHistory || [];

                console.log(`📂 Loaded ${this.promptHistory.length} prompts from session`);
            }
        } catch (error) {
            console.warn('Failed to load prompts from session storage:', error);
            this.currentPrompt = null;
            this.promptHistory = [];
        }
    }

    /**
     * Export prompts as JSON (for debugging/backup)
     * @returns {string} JSON string of all prompts
     */
    exportPrompts() {
        return JSON.stringify({
            currentPrompt: this.currentPrompt,
            promptHistory: this.promptHistory,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }
}

// Create and export a singleton instance
const promptStorageService = new PromptStorageService();

export default promptStorageService;
