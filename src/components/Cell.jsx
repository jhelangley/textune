export default function Cell ({ char, pitch, timing, onClick }) {
    let timingSymbol;
    if (timing === 0.25) timingSymbol = '◐';
    if (timing === 0.5) timingSymbol = '●';
    if (timing === 0.75) timingSymbol = '●◐';
    if (timing === 1) timingSymbol = '●●';
    if (timing === 1.5) timingSymbol = '⦵⦵';
    
    return (
                <div className='character-cell' onClick={onClick}>
                    <span className='cell-char'>{char}</span>
                    <span className='cell-pitch'>{pitch}</span>
                    <span className='cell-timing'>{timingSymbol}</span>
                </div>
      )
    }

