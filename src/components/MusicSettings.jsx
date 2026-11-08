const roots = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
const scales = ['major', 'minor', 'majorPenta', 'minorPenta', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian']


export default function MusicSettings ({musicSettings, setMusicSettings }) {

    const changeRoot = (direction) => {
        const currentIndex = roots.indexOf(musicSettings.root);
        const newIndex = (currentIndex + direction + roots.length) % roots.length;
        setMusicSettings(prev => ({...prev, root: roots[newIndex]}))
        return;
    }

    const changeScale = (direction) => {
        const currentIndex = scales.indexOf(musicSettings.scale);
        const newIndex = (currentIndex + direction + scales.length) % scales.length;
        setMusicSettings(prev => ({...prev, scale: scales[newIndex]}))
        return;
    }


    return (
        <div id='music-settings-container'>
            <label>Root:</label>
            <button onClick={() => changeRoot(-1)}>⬅</button>
            <select className='music-settings' value={musicSettings.root} 
            onChange={e => setMusicSettings(prev => ({...prev, root: e.target.value}))}>
                <option value='c'>C</option>
                <option value='d'>D</option>
                <option value='e'>E</option>
                <option value='f'>F</option>
                <option value='g'>G</option>
                <option value='a'>A</option>
                <option value='b'>B</option>
            </select>
            <button onClick={() => changeRoot(1)}>⮕</button>
            <label>Scale:</label>
            <button onClick={() => changeScale(-1)}>⬅</button>
            <select className='music-settings' value={musicSettings.scale} 
            onChange={e => setMusicSettings(prev => ({...prev, scale: e.target.value}))}>
                <option value='major'>Major</option>
                <option value='minor'>Minor</option>
                <option value='majorPenta'>Major Pentatonic</option>
                <option value='minorPenta'>Minor Pentatonic</option>
                <option value='dorian'>Dorian</option>
                <option value='phrygian'>Phrygian</option>
                <option value='lydian'>Lydian</option>
                <option value='mixolydian'>Mixolydian</option>
                <option value='locrian'>Locrian</option>
            </select>
            <button onClick={() => changeScale(1)}>⮕</button>
        </div>
    )
}