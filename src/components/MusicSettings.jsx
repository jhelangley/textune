export default function MusicSettings ({musicSettings, setMusicSettings }) {
    return (
        <div id='music-settings-container'>
            <label>Root:</label>
            <select className='music-settings' value={musicSettings.root} 
            onChange={e => setMusicSettings(prev => ({...prev, root: e.target.value}))}>
                <option value='a'>A</option>
                <option value='b'>B</option>
                <option value='c'>C</option>
                <option value='d'>D</option>
                <option value='e'>E</option>
                <option value='f'>F</option>
                <option value='g'>G</option>
            </select>
            <label>Scale:</label>
            <select className='music-settings' value={musicSettings.scale} 
            onChange={e => setMusicSettings(prev => ({...prev, scale: e.target.value}))}>
                <option value='major'>Major</option>
                <option value='minor'>Minor</option>
                <option value='majorPenta'>Major Pentatonic</option>
                <option value='minorPenta'>Minor Pentatonic</option>
            </select>
        </div>
    )
}