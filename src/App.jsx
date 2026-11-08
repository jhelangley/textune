import { useState, useRef } from 'react'
import * as Tone from 'tone';
import './App.css'
import Cell from './components/Cell.jsx'
import TextInput from './components/TextInput.jsx'
import PlayBackControl from './components/PlaybackControl.jsx'
import MusicSettings from './components/MusicSettings.jsx'
import { generateSequence } from './music/generateSequence.js'




function App() {
  
  const [inputText, setInputText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeCellIndex, setActiveCellIndex] = useState(0)
  const [musicSettings, setMusicSettings] = useState({root: 'c', scale: 'major'})
  
  const sequence = generateSequence(inputText, musicSettings.root, musicSettings.scale)
  
  const synth = useRef(null);
  
  const playNote = async (pitch) => {
    if (synth.current === null) synth.current = new Tone.Synth().toDestination();
    await Tone.start();
    if (pitch === null) return;
    const note = Tone.Frequency(pitch, "midi").toNote()
    synth.current.triggerAttackRelease(note, "8n")
  }

  const handleTextChange = () => {
    
  }
  
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
    { sequence.map(noteEvent => (
      <Cell key={noteEvent.index} 
      char={noteEvent.char} 
      pitch={noteEvent.pitch}
      timing={noteEvent.timing}
      onClick={() => playNote(noteEvent.pitch)}
      />))}
      </div>
      <button onClick={() => playNote(65)}>Test sound</button>
      
      </>
    )
  }
  
  export default App
  