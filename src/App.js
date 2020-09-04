import React, { useState, useEffect } from 'react';
import './App.css';

const resource = 'http://localhost:3001';
const params = '/messages';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const getLatestMessages = () =>
    fetch(`${resource}${params}`)
      .then(res => res.json())
      .then(data =>
        setMessages(data.sort((prev, curr) => (prev.id < curr.id ? 1 : -1)))
      );

  const postMessage = (from, text) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        from,
        text,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch(`${resource}${params}`, options).then(getLatestMessages);
  };

  const deleteMessage = async id => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const msgId = `/${id}`;
    console.log(id);

    const deletedMsg = await fetch(`${resource}${params}${msgId}`, options)
      .then(res => {
        if (res.ok) {
          return Promise.resolve('User deleted.');
        } else {
          return Promise.reject('An error occurred.');
        }
      })
      .then(getLatestMessages);

    return deletedMsg;
  };

  useEffect(() => {
    getLatestMessages();
  });

  return (
    <div style={{ width: '24rem' }}>
      {messages.map(({ text, from, id }) => (
        <div style={{ paddingBottom: '1rem' }} key={id}>
          <div>
            <span>{text}</span>
            <span style={{ maxWidth: '8rem', float: 'right' }}>
              <button onClick={() => deleteMessage(id)}>Delete</button>
            </span>
          </div>
          <div>{from}</div>
        </div>
      ))}
      <button onClick={getLatestMessages}>Latest Messages</button>
      <div>
        <h3>Create a message</h3>
        <div>
          <label>Name</label>
          <div>
            <input
              placeholder="Enter your name"
              onChange={e => setName(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <label>Message</label>
          <div>
            <input
              placeholder="What’s on your mind?"
              onChange={e => setNewMessage(e.target.value)}
            ></input>
          </div>
        </div>
        <button onClick={() => postMessage(name, newMessage)}>
          Create Message
        </button>
      </div>
    </div>
  );
}

export default App;
