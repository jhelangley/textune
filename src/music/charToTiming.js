const durations = [
    0.75,      // a
    0.5,    // b
    0.5,    // c
    0.25,    // d
    0.75,      // e
    0.5,    // f
    0.5,    // g
    0.25,    // h
    0.75,      // i
    1,      // j
    1,      // k
    0.25,    // l
    0.5,    // m
    0.25,    // n
    0.75,      // o
    0.5,    // p
    1,      // q
    0.25,    // r
    0.25,    // s 
    0.75,      // t
    0.25,    // u
    1,      // v
    0.5,    // w
    1,      // x
    0.5,    // y
    1       // z
]

export function charToTiming (char) {
    const alphaPos = char.toUpperCase().charCodeAt() - 65;
    if (alphaPos < 0 || alphaPos > 25) return 2;
    return durations[alphaPos];
}