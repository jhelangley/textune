import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone';
import './App.css'
import Cell from './components/Cell.jsx'
import TextInput from './components/TextInput.jsx'
import PlayBackControl from './components/PlaybackControl.jsx'
import MusicSettings from './components/MusicSettings.jsx'
import { charToPitch } from './music/charToPitch.js';
import { generateSequence } from './music/generateSequence.js'




function App() {
  
  const [inputText, setInputText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeCellIndex, setActiveCellIndex] = useState(0)
  const [musicSettings, setMusicSettings] = useState({root: 'c', scale: 'major'})
  
  const sequence = generateSequence(inputText, musicSettings.root, musicSettings.scale)
  const qNote = Tone.Time("4n").toSeconds();
  
  const synth = useRef(null);
  const partRef = useRef(null);
  
  const playNote = async (pitch) => {
    if (synth.current === null) synth.current = new Tone.Synth().toDestination();
    await Tone.start();
    if (pitch === null) return;
    const note = Tone.Frequency(pitch, "midi").toNote()
    synth.current.triggerAttackRelease(note, "8n")
  }
  
  const startPlayback = async () => {
    if (sequence.length === 0) {
      console.log("Sequence must contain at least one note");
      return
    }
    if (synth.current === null) synth.current = new Tone.Synth().toDestination();
    await Tone.start();
     
    const noteArray = sequence.map((noteEvent) => {
      
      const startTime = Tone.Time(noteEvent.startTime * qNote).toBarsBeatsSixteenths()
      const noteName = noteEvent.pitch == null ? null : Tone.Frequency(noteEvent.pitch, "midi").toNote();
      
      
      return { time: startTime, note: noteName, index: noteEvent.index }
    })
    const part = new Tone.Part((time, event) => {
      if (event.note !== null) {
        synth.current.triggerAttackRelease(event.note, "8n", time);
      } 
    }, noteArray);
    
    part.loop = true;
    part.loopStart = 0;
    
    const loopEnd = () => {
      const lastEvent = sequence[sequence.length-1]
      const endTime = lastEvent.startTime + lastEvent.timing
      return Tone.Time(endTime * qNote).toBarsBeatsSixteenths()
    }
    
    part.loopEnd = loopEnd();
    

    const transport = Tone.getTransport();
    transport.stop()
    
    partRef.current?.dispose();
    partRef.current = part;
    
    partRef.current.start(0);
    transport.start();
  } 
  
  const handlePlayback = async () => {
    const transport = Tone.getTransport();
    if (transport.state === "stopped") {
      await startPlayback()
      setIsPlaying(true);
    } else if (transport.state === "started") {
      transport.pause();
      setIsPlaying(false);
    } else if (transport.state === "paused") {
      transport.start()
      setIsPlaying(true);
    }
  }

  const restartPlayback = () => {
    const transport = Tone.getTransport();
    transport.position = 0;
  }
  
  useEffect(() => {
    
    const handleKeyDown = (event) => {
      if (/^[a-zA-Z]$/.test(event.key) && !event.repeat) {
        const note = charToPitch(event.key, musicSettings.root, musicSettings.scale)
        playNote(note)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [musicSettings])
  
  
  return (
    <>
    <PlayBackControl 
    isPlaying={isPlaying}
    setIsPlaying={setIsPlaying}
    isMuted={isMuted}
    setIsMuted={setIsMuted}
    handlePlayback={handlePlayback}
    restartPlayback={restartPlayback}
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
  