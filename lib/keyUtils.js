var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var MAJOR_KEYS = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "Bb",
    "Eb",
    "Ab",
    "Db",
    "Gb",
    "C#",
    "D#",
    "F#",
    "G#",
    "A#"
];
var MINOR_KEYS = ["Am", "Bm", "Cm", "Dm", "Em", "F#m", "G#m", "Bbm", "Ebm"];
var KEY_MAP = {
    "a minor": "Am",
    "b minor": "Bm",
    "c minor": "Cm",
    "d minor": "Dm",
    "e minor": "Em",
    "f# minor": "F#m",
    "g# minor": "G#m",
    "bb minor": "Bbm",
    "eb minor": "Ebm"
};
export var UNKNOWN_KEY = "키 미확인";
function normalizeFlatSharp(text) {
    return text
        .replace(/♭/g, "b")
        .replace(/＃/g, "#")
        .replace(/샵/gi, "#")
        .replace(/플랫/gi, "b")
        .trim();
}
export function normalizeKey(raw) {
    if (!raw) {
        return UNKNOWN_KEY;
    }
    var lowered = normalizeFlatSharp(raw).toLowerCase().trim();
    if (KEY_MAP[lowered]) {
        return KEY_MAP[lowered];
    }
    var clean = normalizeFlatSharp(raw).replace(/\s+/g, "");
    var minorMatch = clean.match(/^([A-G](?:#|b)?)m$/i);
    if (minorMatch) {
        var note = minorMatch[1];
        return "".concat(note[0].toUpperCase()).concat(note.slice(1), "m");
    }
    var majorMatch = clean.match(/^([A-G](?:#|b)?)$/i);
    if (majorMatch) {
        var note = majorMatch[1];
        return "".concat(note[0].toUpperCase()).concat(note.slice(1));
    }
    return UNKNOWN_KEY;
}
export function extractKeyFromTitle(title) {
    var source = normalizeFlatSharp(title);
    var lowered = source.toLowerCase();
    var minorWord = lowered.match(/\b([a-g](?:#|b)?)\s*(?:minor)\b/i);
    if (minorWord) {
        return normalizeKey("".concat(minorWord[1], "m"));
    }
    var minorCompact = source.match(/\b([A-G](?:#|b)?)m\b/);
    if (minorCompact) {
        return normalizeKey(minorCompact[0]);
    }
    var majorWithMarker = source.match(/\b([A-G](?:#|b)?)\s*(?:key|키)\b/i);
    if (majorWithMarker) {
        return normalizeKey(majorWithMarker[1]);
    }
    var allKnown = __spreadArray(__spreadArray([], MINOR_KEYS, true), MAJOR_KEYS, true).sort(function (a, b) { return b.length - a.length; });
    for (var _i = 0, allKnown_1 = allKnown; _i < allKnown_1.length; _i++) {
        var key = allKnown_1[_i];
        var escaped = key.replace("#", "\\#");
        var regex = new RegExp("\\b".concat(escaped, "\\b"), "i");
        if (regex.test(source)) {
            return normalizeKey(key);
        }
    }
    return UNKNOWN_KEY;
}
export function groupByKey(items) {
    return items.reduce(function (acc, item) {
        var groupKey = item.key || UNKNOWN_KEY;
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
}
