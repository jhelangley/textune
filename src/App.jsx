import { useState } from 'react'
import './App.css'
import Cell from './components/Cell.jsx'

function App() {
  const [inputText, setInputText] = useState('')
  return (
    <>
      <input type='text' value={inputText} onChange={(e) => {setInputText(e.target.value)}}></input>
      <div className='character-grid'>{inputText.split('').map((char, index) => <Cell key={index} char={char} />)}
      </div>
      
    </>
  )
}

export default App
