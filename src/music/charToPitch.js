import { scales, roots } from "./scales";

export function charToPitch (char, root, scale) {
    const scaleIntervals = scales[scale];
    const rootOffset = roots[root];
    const alphaPos = char.toUpperCase().charCodeAt() - 65;
    if (alphaPos < 0 || alphaPos > 25) return null;
    const noteOffset = scaleIntervals[alphaPos % scaleIntervals.length];
    const octave = Math.floor(alphaPos / scaleIntervals.length);
    return 36 + rootOffset + noteOffset + (octave * 12)
}