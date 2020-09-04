import React, { useState, useEffect } from 'react'
import './App.css'

const resource = 'http://localhost:3001'
const params = '/messages'

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const getMessages = () => {
    fetch(`${resource}${params}`)
      .then(res => res.json())
      .then(data =>
        setMessages(data.sort((prev, curr) => (prev.id < curr.id ? 1 : -1)))
      )
  }

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
    }

    fetch(`${resource}${params}`, options).then(getMessages)
  }

  const deleteMessage = id => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch(`${resource}${params}/${id}`, options).then(getMessages)
  }

  useEffect(() => {
    getMessages()
  })

  return (
    <section style={{ width: '24rem' }}>
      <article>
        {messages.map(({ text, from, id }) => (
          <div style={{ paddingBottom: '1rem' }} key={id}>
            <span>{text}</span>
            <span style={{ maxWidth: '8rem', float: 'right' }}>
              <button onClick={() => deleteMessage(id)}>Delete</button>
            </span>
            <div>{from}</div>
          </div>
        ))}

        <button onClick={getMessages}>Latest Messages</button>
      </article>

      <article>
        <h3>Create a message</h3>

        <label>Name</label>
        <div>
          <input
            placeholder="Enter your name"
            onChange={e => setName(e.target.value)}
          ></input>
        </div>

        <label>Message</label>
        <div>
          <input
            placeholder="What’s on your mind?"
            onChange={e => setText(e.target.value)}
          ></input>
        </div>

        <button onClick={() => postMessage(name, text)}>Create Message</button>
      </article>
    </section>
  )
}

export default App
