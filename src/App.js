import React, { useState } from 'react';
import './App.css';

const params = '/messages';

const url = `http://localhost:3001${params}`;

function App() {
  const [messages, setMessages] = useState([]);

  fetch(url)
    .then(res => res.json())
    .then(data => setMessages(data));

  return <div>{JSON.stringify(messages)}</div>;
}

export default App;
