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

    signature: import.meta.env.VITE_DASHBOARD_SIGNATURE || "Love always, [YOUR NAME]",

    // PRONOUN CONFIG
    pronoun: import.meta.env.VITE_PRONOUN || "She",

    memoriesSubtitle: "Capturing everything since Day 1",
    loadingText: import.meta.env.VITE_MEMORIES_LOADING_TEXT || "Loading Shared Content...",

    // LOCK SCREEN CONFIG
    lockCode: import.meta.env.VITE_LOCK_CODE || "ROSE",
    lockHint: import.meta.env.VITE_LOCK_HINT || "I age quickly, but I'm picked every year. I cannot speak yet say \"I love you\". What am I?",

    // IMAGE CONFIG
    initialImage: import.meta.env.VITE_INITIAL_IMAGE || null, // If null, uses MailSymbol

    // MEMORIES CONFIG
    // Provide a list of image URLs in your .env file (supports commas or newlines)
    memories: (() => {
        const raw = import.meta.env.VITE_MEMORIES_IMAGES || "";
        // Match items inside [brackets] OR any sequences of non-comma/non-newline characters
        const regex = /\[.*?\]|[^,\n]+/g;
        const matches = raw.match(regex) || [];

        return matches.map(str => {
            const s = str.trim();
            if (!s) return null;
            if (s.startsWith('[') && s.endsWith(']')) {
                return { type: 'header', text: s.slice(1, -1).trim() };
            }
            return { type: 'image', url: s };
        }).filter(Boolean);
    })(),


    // Format: YYYY-MM-DD and HH:mm:ss
    unlockDate: import.meta.env.VITE_UNLOCK_DATE || "2026-02-14",
    unlockTime: import.meta.env.VITE_UNLOCK_TIME || "00:00:00",
    timezone: import.meta.env.VITE_TIMEZONE || "America/Guayaquil", // e.g., "America/Guayaquil", "Europe/London", "UTC"
};
