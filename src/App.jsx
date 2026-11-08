import { useState, useRef, useEffect, useMemo } from 'react'
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
  const [activeCellIndex, setActiveCellIndex] = useState(null)
  const [musicSettings, setMusicSettings] = useState({root: 'c', scale: 'major'})
  
  const sequence = useMemo(
    () => generateSequence(inputText, musicSettings.root, musicSettings.scale), 
    [inputText, musicSettings.root, musicSettings.scale]
  );
  
  const synth = useRef(null);
  const partRef = useRef(null);
  
  const playNote = async (pitch) => {
    if (synth.current === null) synth.current = new Tone.Synth().toDestination();
    await Tone.start();
    if (pitch === null) return;
    const note = Tone.Frequency(pitch, "midi").toNote()
    synth.current.triggerAttackRelease(note, "8n")
  }
  
  const prepToneEvents = (sequence) => {
    const qNote = Tone.Time("4n").toSeconds();
    
    // convert sequence into Tone.Part events
    const noteArray = sequence.map((noteEvent) => {
      
      const startTime = Tone.Time(noteEvent.startTime * qNote).toBarsBeatsSixteenths()
      const noteName = noteEvent.pitch == null ? null : Tone.Frequency(noteEvent.pitch, "midi").toNote();
      
      return { time: startTime, note: noteName, index: noteEvent.index }
    })
    
    // calculate loop end point for Tone.Part
    const lastEvent = sequence[sequence.length-1]
    const endTime = lastEvent.startTime + lastEvent.timing
    const loopEnd = Tone.Time(endTime * qNote).toBarsBeatsSixteenths()
    
    return { noteArray, loopEnd }
  }
  
  
  
  const startPlayback = async () => {
    if (sequence.length === 0) {
      console.log("Sequence must contain at least one note");
      return;
    }
    
    if (synth.current === null) synth.current = new Tone.Synth().toDestination();
    
    await Tone.start();
    
    const { noteArray, loopEnd } = prepToneEvents(sequence)
    
    const part = new Tone.Part((time, event) => {
      if (event.note !== null) {
        synth.current.triggerAttackRelease(event.note, "8n", time);
      } 
      Tone.getDraw().schedule(() => setActiveCellIndex(event.index), time)
    }, noteArray);
    
    part.loop = true;
    part.loopStart = 0;
    part.loopEnd = loopEnd;
    
    
    const transport = Tone.getTransport();
    transport.stop()
    
    partRef.current?.dispose();
    partRef.current = part;
    
    partRef.current.start(0);
    transport.start();

    
  } 
  
  const handlePlayback = async () => {
    if (sequence.length === 0) return;
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
      if (isPlaying) return;
      if (/^[a-zA-Z]$/.test(event.key) && !event.repeat) {
        const note = charToPitch(event.key, musicSettings.root, musicSettings.scale)
        playNote(note)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [musicSettings, isPlaying])
  
  
  
  useEffect(() => {
    const transport = Tone.getTransport();
    Tone.getDraw().cancel();
    if (partRef.current === null) return;
    if (sequence.length === 0) {
      transport.stop();
      partRef.current.dispose();
      partRef.current = null;
      setIsPlaying(false);
      return;
    }
    // const wasPlaying = (transport.state === 'started');
    // transport.stop();
    partRef.current.clear();
    const { noteArray, loopEnd } = prepToneEvents(sequence);
    noteArray.forEach(event => partRef.current.add(event));
    partRef.current.loopEnd = loopEnd;
    // if (wasPlaying) transport.start(); 
  }, [sequence])
  
  
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
      isActive={noteEvent.index === activeCellIndex}
      />))}
      </div>
      <button onClick={() => playNote(65)}>Test sound</button>
      
      </>
    )
  }
  
  export default App
  