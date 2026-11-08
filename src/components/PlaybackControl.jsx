export default function PlayBackControls ({ isPlaying, isMuted, setIsPlaying, setIsMuted, handlePlayback, restartPlayback }) {
    return (
        <div id='playback-container'>
        <button id='play-pause' className='playback-controls' 
            onClick={() => {
                handlePlayback();
            }}>

            {isPlaying ? "Pause" : "Play"}
        </button>
        <button id='mute' className='playback-controls' onClick={() => setIsMuted(!isMuted)}>{isMuted ? "Unmute" : "Mute"}</button>
        <button id='restart' className='playback-controls' onClick={() => restartPlayback()}>Restart</button>
        </div>
    )
}