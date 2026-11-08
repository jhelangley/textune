export default function PlayBackControls ({ isPlaying, handlePlayback, restartPlayback }) {
    return (
        <div className='control-box'>
            <div className='control-title'>PLAYBACK</div>
            <div className='control-body'>
        <button id='play-pause' className='playback-controls' 
            onClick={() => {
                handlePlayback();
            }}>

            {isPlaying ? "Pause" : "Play"}
        </button>
        <button id='restart' className='playback-controls' onClick={() => restartPlayback()}>Restart</button>
        </div>
        </div>
    )
}