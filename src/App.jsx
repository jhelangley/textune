import { useState } from 'react'
import './App.css'
import Cell from './components/Cell.jsx'
import TextInput from './components/TextInput.jsx'

function App() {
  const [inputText, setInputText] = useState('')
  return (
    <>
      <TextInput value={inputText} onChange={setInputText}/>
      <div className='character-grid'>{inputText.split('').map((char, index) => <Cell key={index} char={char} />)}
      </div>
      
    </>
  )
}

export default App
