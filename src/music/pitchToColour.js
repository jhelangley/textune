

export function pitchToColour (pitch) {
    
    const octave = Math.floor(pitch / 12) - 1;
    const hue = (pitch % 12) * 30;
    const lightness = octave * 5 + 40;
    
    return (`hsl(${hue}deg 90% ${lightness}% / 0.3)`)
    
}