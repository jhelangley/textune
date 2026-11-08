export default function PlayBackControls ({ isPlaying, isMuted, setIsPlaying, setIsMuted }) {
    return (
        <div id='playback-container'>
        <button id='play-pause' className='playback-controls' onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
        <button id='mute' className='playback-controls' onClick={() => setIsMuted(!isMuted)}>{isMuted ? "Unmute" : "Mute"}</button>
        <button id='restart' className='playback-controls' onClick={() => console.log('reset index to 0')}>Restart</button>
        </div>
    )
}