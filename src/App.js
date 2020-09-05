import React, { useState, useEffect } from 'react'
import './App.css'

const resource = 'https://cyf-node-chat-server.glitch.me/'
const params = '/messages'

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [showTextbox, setShowTextbox] = useState('')

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

  const updateMessage = id => {
    if (text) {
      const options = {
        method: 'PUT',
        body: JSON.stringify({
          text,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }

      fetch(`${resource}${params}/${id}`, options).then(() => {
        setShowTextbox('')
        getMessages()
      })
    }

    return
  }

  const cancelUpdate = id =>
    new Promise(resolve => {
      resolve(id)
    }).then(() => {
      setShowTextbox('')
      getMessages()
    })

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
  }, [])

  return (
    <section className="app">
      <article className="app-feed">
        <h3>Message Feed</h3>

        {messages.map(({ text, from, id }) => (
          <div
            className="app-message"
            key={id}
            onClick={() => setShowTextbox(id)}
          >
            {showTextbox === id ? (
              <input
                className="app-message__input"
                onChange={e => setText(e.target.value)}
              ></input>
            ) : (
              <span>{text}</span>
            )}

            <span className="app-message-btn-del">
              {showTextbox === id ? (
                <>
                  <button onClick={() => updateMessage(id)}>Update</button>
                  <button onClick={() => cancelUpdate('')}>Cancel</button>
                </>
              ) : (
                <button onClick={() => deleteMessage(id)}>Delete</button>
              )}
            </span>
            <div>{from}</div>
          </div>
        ))}

        <button onClick={getMessages}>Latest Messages</button>
      </article>

      <article className="app-create">
        <h3>Create a message</h3>

        <div className="app-create">
          <label className="app-create">Name</label>
          <div>
            <input
              className="app-create"
              placeholder="Enter your name"
              onChange={e => setName(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="app-create">
          <label className="app-create">Message</label>
          <div>
            <input
              className="app-create"
              placeholder="What’s on your mind?"
              onChange={e => setText(e.target.value)}
            ></input>
          </div>
        </div>

        <button onClick={() => postMessage(name, text)}>Create Message</button>
      </article>
    </section>
  )
}

export default App
