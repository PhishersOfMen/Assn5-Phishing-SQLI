const emojiCodes = [
    0x1F607,    // Smiling Halo
    0x1F928,    // Raised Eyebrow
    0x1F631     // Screaming in fear
];

function spanify(strings, value = null, cl='') {
    if (value != null) {
        return `<span${cl?` class="${cl}"`:""}>${strings[0]}${value}${strings[1]}</span>`;
    } else {
        return `<span${cl?` class="${cl}"`:""}>${strings[0]}</span>`;
    }
}

function getEmojiAndColorByPercentage(percentage, threshold) {
    if (percentage < threshold) {
        return String.fromCodePoint(emojiCodes[0]);
    } else if (percentage > 1-threshold) {
        return String.fromCodePoint(emojiCodes[2]);
    } else {
        return String.fromCodePoint(emojiCodes[1]);
    }
}

function setScale(percentage, threshold) {
    let scaleEl = document.querySelector("#scale");
    let resultsEl = document.getElementById("results");
    let emojiEl = document.getElementById("emoji");
    let emoji = getEmojiAndColorByPercentage(percentage, threshold);

    emojiEl.innerText = emoji;
    if (percentage < threshold) {
        resultsEl.classList.remove("danger", "warning");
        resultsEl.classList.add("success");
    } else if (percentage > 1-threshold) {
        resultsEl.classList.remove("success", "warning");
        resultsEl.classList.add("danger");
    } else {
        resultsEl.classList.remove("success", "danger");
        resultsEl.classList.add("warning");
    }
}