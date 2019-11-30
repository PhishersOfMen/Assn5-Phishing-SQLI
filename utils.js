const emojiCodes = [
    0x1F607,    // Smiling Halo
    0x1F642,    // Slightly Smiling
    0x1F928,    // Raised Eyebrow
    0x1F627,    // Anguished
    0x1F631     // Screaming in fear
];


function getEmojiByPercentage(percent) {
    if (percent < 0.2) {
        return String.fromCodePoint(emojiCodes[0])
    } else if (percent < 0.4) {
        return String.fromCodePoint(emojiCodes[1])
    } else if (percent < 0.6) {
        return String.fromCodePoint(emojiCodes[2])
    } else if (percent < 0.8) {
        return String.fromCodePoint(emojiCodes[3])
    } else {
        return String.fromCodePoint(emojiCodes[4])
    }
}