const emojiCodes = [
    0x1F607,    // Smiling Halo
    0x1F642,    // Slightly Smiling
    0x1F928,    // Raised Eyebrow
    0x1F627,    // Anguished
    0x1F631     // Screaming in fear
];


function getEmojiAndColorByPercentage(percentage) {
    if (percentage < 0.2) {
        return [
            String.fromCodePoint(emojiCodes[0]),
            "" // pick color
        ];
    } else if (percentage < 0.4) {
        return [
            String.fromCodePoint(emojiCodes[1]),
            "" // pick color
        ];
    } else if (percentage < 0.6) {
        return [
            String.fromCodePoint(emojiCodes[2]),
            "" // pick color
        ];
    } else if (percentage < 0.8) {
        return [
            String.fromCodePoint(emojiCodes[3]),
            "" // pick color
        ];
    } else {
        return [
            String.fromCodePoint(emojiCodes[4]),
            "" // pick color
        ];
    }
}

function setScale(percentage) {
    let scaleEl = document.querySelector("#scale");
    let emojiEl = document.getElementById("emoji");
    let emoji = getEmojiAndColorByPercentage(percentage);

    emojiEl.innerText = emoji;
    scaleEl.width
}