const MAJOR_KEYS = [
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

const MINOR_KEYS = ["Am", "Bm", "Cm", "Dm", "Em", "F#m", "G#m", "Bbm", "Ebm"];

const KEY_MAP: Record<string, string> = {
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

export const UNKNOWN_KEY = "키 미확인";

function normalizeFlatSharp(text: string): string {
  return text
    .replace(/♭/g, "b")
    .replace(/＃/g, "#")
    .replace(/샵/gi, "#")
    .replace(/플랫/gi, "b")
    .trim();
}

export function normalizeKey(raw: string): string {
  if (!raw) {
    return UNKNOWN_KEY;
  }

  const lowered = normalizeFlatSharp(raw).toLowerCase().trim();
  if (KEY_MAP[lowered]) {
    return KEY_MAP[lowered];
  }

  const clean = normalizeFlatSharp(raw).replace(/\s+/g, "");
  const minorMatch = clean.match(/^([A-G](?:#|b)?)m$/i);
  if (minorMatch) {
    const note = minorMatch[1];
    return `${note[0].toUpperCase()}${note.slice(1)}m`;
  }

  const majorMatch = clean.match(/^([A-G](?:#|b)?)$/i);
  if (majorMatch) {
    const note = majorMatch[1];
    return `${note[0].toUpperCase()}${note.slice(1)}`;
  }

  return UNKNOWN_KEY;
}

export function extractKeyFromTitle(title: string): string {
  const source = normalizeFlatSharp(title);
  const lowered = source.toLowerCase();

  const minorWord = lowered.match(/\b([a-g](?:#|b)?)\s*(?:minor)\b/i);
  if (minorWord) {
    return normalizeKey(`${minorWord[1]}m`);
  }

  const minorCompact = source.match(/\b([A-G](?:#|b)?)m\b/);
  if (minorCompact) {
    return normalizeKey(minorCompact[0]);
  }

  const majorWithMarker = source.match(/\b([A-G](?:#|b)?)\s*(?:key|키)\b/i);
  if (majorWithMarker) {
    return normalizeKey(majorWithMarker[1]);
  }

  const allKnown = [...MINOR_KEYS, ...MAJOR_KEYS].sort((a, b) => b.length - a.length);
  for (const key of allKnown) {
    const escaped = key.replace("#", "\\#");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(source)) {
      return normalizeKey(key);
    }
  }

  return UNKNOWN_KEY;
}

export function groupByKey<T extends { key: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = item.key || UNKNOWN_KEY;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
}
