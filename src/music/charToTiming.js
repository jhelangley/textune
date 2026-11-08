const durations = [
    1,      // a
    1.5,    // b
    1.5,    // c
    0.5,    // d
    1,      // e
    1.5,    // f
    1.5,    // g
    0.5,    // h
    1,      // i
    2,      // j
    2,      // k
    0.5,    // l
    1.5,    // m
    0.5,    // n
    1,      // o
    1.5,    // p
    2,      // q
    0.5,    // r
    0.5,    // s 
    1,      // t
    0.5,    // u
    2,      // v
    1.5,    // w
    2,      // x
    1.5,    // y
    2       // z
]

export function charToTiming (char) {
    const alphaPos = char.toUpperCase().charCodeAt() - 65;
    if (alphaPos < 0 || alphaPos > 25) return 1;
    return durations[alphaPos];
}