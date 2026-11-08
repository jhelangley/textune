import { useState, useRef, useEffect, useMemo } from 'react'
import * as Tone from 'tone';
import './App.css'
import Cell from './components/Cell.jsx'
import TextInput from './components/TextInput.jsx'
import PlayBackControl from './components/PlaybackControl.jsx'
import MusicSettings from './components/MusicSettings.jsx'
import { charToPitch } from './music/charToPitch.js';
import { generateSequence } from './music/generateSequence.js'
import { pitchToColour } from './music/pitchToColour.js';




function App() {
  
  const [inputText, setInputText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeCellIndex, setActiveCellIndex] = useState(null)
  const [musicSettings, setMusicSettings] = useState({root: 'c', scale: 'major', tempo: 100})
  const [backgroundColour, setBackgroundColour] = useState("white")
  
  const sequence = useMemo(
    () => generateSequence(inputText, musicSettings.root, musicSettings.scale), 
    [inputText, musicSettings.root, musicSettings.scale]
  );
  
  const isRest = activeCellIndex !== null && sequence[activeCellIndex]?.pitch === null
  
  const synth = useRef(null);
  const delay = useRef(null);
  const partRef = useRef(null);
  const resumeAfterTypingRef = useRef(false);
  
  const playNote = async (pitch) => {
    if (delay.current === null) delay.current = new Tone.FeedbackDelay(0.20, 0.55).toDestination();
    if (synth.current === null) synth.current = new Tone.Synth().connect(delay.current);
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
      
      return { time: startTime, note: noteName, index: noteEvent.index, midiPitch: noteEvent.pitch }
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
      Tone.getDraw().schedule(() => {
        setActiveCellIndex(event.index)
        if (event.note !== null) { 
          setBackgroundColour(pitchToColour(event.midiPitch)) 
        } else { setBackgroundColour('white')};
      }, time)
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
    
    if (resumeAfterTypingRef.current) {
      resumeAfterTypingRef.current = false;
      setIsPlaying(false);
      return;
    }
    
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
    console.log("restart clicked");
    Tone.getDraw().cancel(0);
    transport.position = 0;
    setActiveCellIndex(null);
    setBackgroundColour('white');
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
    Tone.getTransport().bpm.value = musicSettings.tempo;
  }, [musicSettings.tempo]);
  
  useEffect(() => {
    if (partRef.current === null || inputText.length === 0) return;
    
    const transport = Tone.getTransport();
    
    if (transport.state === "started") {
      transport.pause();
      resumeAfterTypingRef.current = true;
      
      Tone.getDraw().cancel();
      setActiveCellIndex(null);
    }
    
    if (!resumeAfterTypingRef.current) return;
    
    const timeoutId = setTimeout(() => {
      if (!resumeAfterTypingRef.current || partRef.current === null) return;
      
      transport.stop();
      transport.start();
      
      resumeAfterTypingRef.current = false;
    }, 500);
    
    return () => clearTimeout(timeoutId); 
  }, [inputText])
  
  useEffect(() => {
    if (partRef.current === null) return;
    
    const transport = Tone.getTransport();
    
    if (sequence.length === 0) {
      transport.stop();
      partRef.current.dispose();
      partRef.current = null;
      
      resumeAfterTypingRef.current = false;
      
      Tone.getDraw().cancel();
      setActiveCellIndex(null);
      setIsPlaying(false);
      return;
    }
    
    const { noteArray, loopEnd } = prepToneEvents(sequence);
    partRef.current.clear();
    noteArray.forEach(event => partRef.current.add(event));
    partRef.current.loopEnd = loopEnd;
    
  }, [sequence])
  
  
  return (
    <>
    <div className='app-container' style={{ backgroundColor: backgroundColour, transition: `background-color ${isRest ? 2000 : 50}ms ease`}}>
    <header>
    <pre
    style={{
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "12px",
      lineHeight: 1.17,
      whiteSpace: "pre",
      color: "black",
      padding: "8px",
      margin: 20,
    }}
    >
    {`╒═════╗ ╒═════╗ ╒═╗  ╒═╗ ╒═════╗ ╒═╗ ╒═╗ ╒═══╗  ╒═╗ ╒═════╗
└─┐ ╓─╜ │ ╓───╜ └┐╚╗╒╛╓╜ └─┐ ╓─╜ │ ║ │ ║ │   ╚╗ │ ║ │ ╓───╜
  │ ║   │ ╚═╗    └┐╚╛╓╜    │ ║   │ ║ │ ║ │ ╟┐ ╚╗│ ║ │ ╚═╗  
  │ ║   │ ╓─╜    ╒╛╓┐╚╗    │ ║   │ ║ │ ║ │ ║└┐ ╚╡ ║ │ ╓─╜  
  │ ║   │ ╚═══╗ ╒╛╓╜└┐╚╗   │ ║   │ ╚═╛ ║ │ ║ └┐   ║ │ ╚═══╗
  └─╜   └─────╜ └─╜  └─╜   └─╜   └─────╜ └─╜  └───╜ └─────╜`}
      </pre>
      
      
      <TextInput id="text-input" className="text-input" value={inputText} onChange={setInputText}/>
      </header>
      
      <div className='character-grid'>
      { sequence.map(noteEvent => (
        <Cell key={noteEvent.index} 
        char={noteEvent.char} 
        pitch={noteEvent.pitch != null ? Tone.Frequency(noteEvent.pitch, "midi").toNote() : null}
        timing={noteEvent.timing}
        onClick={() => playNote(noteEvent.pitch)}
        isActive={noteEvent.index === activeCellIndex}
        />))}
        </div>
        
        <div className='control-panel'>
        <PlayBackControl 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handlePlayback={handlePlayback}
        restartPlayback={restartPlayback}
        />
        <MusicSettings musicSettings={musicSettings} setMusicSettings={setMusicSettings} />
        </div>
        
        
        
        
        
        </div>
        
        </>
        
      )
    }
    
    export default App
    