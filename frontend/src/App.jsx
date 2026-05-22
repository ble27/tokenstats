import { useState } from 'react';
import pricingData from '../../pricing.json'
const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const PROXY_TOKEN = import.meta.env.VITE_PROXY_TOKEN || '';
  // leave perplexity models out for now 
  const availableModels = [...Object.keys(pricingData.openai)];
  const [model, setModel] = useState(availableModels[0]);

  const handleOnChange = (e) => {
    setPrompt(e.target.value);
  }

  const handleSend = async () => {
    setLoading(true);
    setResponse('');

    try{
      // expect a promise from fetch
      const res = await fetch('http://127.0.0.1:3001/v1/chat', 
        { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PROXY_TOKEN}`
          },
          // actual content aka the prompt
          body: JSON.stringify({
            provider: 'openai', 
            model: model, 
            messages: [{role: 'user', content: prompt}]})
        }
      )
      const data = await res.json();
      if (data.content) {
        setResponse(data.content);
      }
      else {
        setResponse('Error: ' + JSON.stringify(data));
      }
    }
    catch(error) {
      setResponse('Failed to fetch: ' + error.message);
    }
    finally {
      setLoading(false); 
    }
  }
  return (
    <div style = {{maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif'}}>
      <h1> Token Tracker Proxy </h1>
      <div style = {{ marginBottom: '15px'}}>
        <label style = {{ display: 'block', marginBottom: '5px'}}> Select Model: </label>
        <select 
          value = {model}
          onChange = {(e) => setModel(e.target.value)}
          style = {{ width: '100%', padding: '10px'}}>
            {availableModels.map((m) => {
              return <option key = {m}>{m}</option>
            })}
          </select>
      </div>
      <textarea 
        value = {prompt}
        onChange = {handleOnChange}
        rows = {4}
        style = {{ width: '100%', padding: '10px' }}
        placeholder = "Ask something..."
      />
      <button 
        onClick = {handleSend} 
        disabled = {loading} 
        style = {{ padding: '10px 20px '}}>
        {loading ? 'Sending': 'Send'}
      </button>
      <div 
        style={{ marginTop: '20px', padding: '15px', borderRadius: '5px'}}>
          <strong style = {{color: 'white', fontFamily: 'math',}}>Response:</strong>
          <p style = {{whiteSpace: 'pre-wrap', color: 'white', fontFamily: 'math'}}> {response} </p>  
      </div>
    </div>
  )
}

export default App