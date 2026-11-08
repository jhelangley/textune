import { charToPitch } from "./charToPitch";
import { charToTiming } from "./charToTiming";

export function generateSequence (inputText, root, scale) {
    const sequence = [];
    let startTime = 0;
    inputText.split('').forEach((char, index) => {
        const timing = charToTiming(char);
        
        sequence.push({ index: index, 
                        char: char,
                        pitch: charToPitch(char, root, scale),
                        timing: timing,
                        startTime: startTime
        })

        startTime += timing;
    })
    
    return sequence;
};