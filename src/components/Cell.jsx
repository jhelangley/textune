export default function Cell ({ char, pitch, timing }) {
    let timingSymbol;
    if (timing === 0.5) timingSymbol = '⚆';
    if (timing === 1) timingSymbol = '⚇';
    if (timing === 1.5) timingSymbol = '⚈';
    if (timing === 2) timingSymbol = '⚉';
    
    return (
                <div className='character-cell'>
                    <span className='cell-char'>{char}</span>
                    <span className='cell-pitch'>{pitch}</span>
                    <span className='cell-timing'>{timingSymbol}</span>
                </div>
      )
    }

