/**
 * DASHBOARD CONTENT CONFIGURATION
 * 
 * This file pulls content from environment variables if they exist.
 * Create a .env file in the root directory and use the keys from .env.example
 * to set your personal messages without changing the code.
 */

export const DASHBOARD_CONTENT = {
    // Falls back to defaults if .env isn't set
    messageTitle: import.meta.env.VITE_DASHBOARD_MESSAGE_TITLE || "Dear Valentine",

    personalMessage: import.meta.env.VITE_DASHBOARD_PERSONAL_MESSAGE || "Saying 'Yes' was the best choice you could have made! Happy Valentine's Day! I'm so lucky to have you. ❤️",

    signature: import.meta.env.VITE_DASHBOARD_SIGNATURE || "Love always,",

    memoriesSubtitle: "Capturing everything since Day 1",
    loadingText: "Loading Shared Content...",
};
