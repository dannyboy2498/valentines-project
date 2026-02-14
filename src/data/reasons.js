// This will match reasons.json ONLY if it exists, preventing build errors if missing
const customModules = import.meta.glob('./reasons.json', { eager: true, import: 'default' });
const customReasons = Object.values(customModules)[0];

const defaultReasons = [
    "Your smile lights up my entire world.",
    "The way you laugh at my terrible jokes.",
    "Your kindness towards everyone you meet.",
    "How you make even mundane days feel like an adventure.",
    "The way you look when you're focusing on something you love.",
    "Your unwavering support for my dreams.",
    "How safe I feel when I'm with you.",
    "Your silly dance moves that you only show me.",
    "The way you listen even when you don't understand me.",
    "Your passion to just live life and be happy.",
    "How you always know the right thing to say to make me laugh",
    "Your warm hugs that melt away my stress.",
    "The coffee you make (or how you drink it).",
    "Your resilience in the face of challenges.",
    "Because you are simply, wonderfully YOU."
];

export const reasons = (customReasons && customReasons.length > 0) ? customReasons : defaultReasons;