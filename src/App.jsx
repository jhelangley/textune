import { useState } from 'react'
import './App.css'
import Cell from './components/Cell.jsx'
import TextInput from './components/TextInput.jsx'
import PlayBackControl from './components/PlaybackControl.jsx'
import MusicSettings from './components/MusicSettings.jsx'
import { charToPitch } from './music/charToPitch.js'
import { charToTiming } from './music/charToTiming.js'

function App() {
  const [inputText, setInputText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeCellIndex, setActiveCellIndex] = useState(0)
  const [musicSettings, setMusicSettings] = useState({root: 'c', scale: 'major'})

  return (
    <>
      <PlayBackControl 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        />
        <MusicSettings musicSettings={musicSettings} setMusicSettings={setMusicSettings} />
      <TextInput value={inputText} onChange={setInputText}/>
      <div className='character-grid'>
        { inputText.split('').map((char, index) => (
          <Cell key={index} 
                char={char} 
                pitch={charToPitch(char, musicSettings.root, musicSettings.scale)}
                timing={charToTiming(char)}
                />))}
      </div>
      
    </>
  )
}

export default App
