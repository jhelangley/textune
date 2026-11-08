export default function TextInput ({value, onChange}) {
    return (
        <div className="control-box text-input-box">
      <div className="control-title">
      TEXT INPUT
      </div>
      
      <div className="control-body">
        <textarea type='text-area' value={value} onChange={e => onChange(e.target.value)} placeholder="Enter your text here and turn it into a tune..."></textarea>
        </div>
        </div>
    )
}


// (e) => {setInputText(e.target.value)}