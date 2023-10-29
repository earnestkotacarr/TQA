import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WelcomeBanner from './WelcomeBanner.jsx'
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner'

function App() {
  const [count, setCount] = useState(0)
  const [userName, setUserName] = useState("Stranger")
  const [transcript, setTranscript] = useState({ loading: true })

  async function getTranscript() {
    let response = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`, {
      withCredentials: false,
    })
    console.log(response.data)
    setTranscript({ loading: false, data: response.data.title })
  }


  useEffect(() => {
    getTranscript()
  }, [])

  useEffect( (loading) => {
    if(!loading) {
      var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';

      (new Audio(mp3_url)).play()
    }
  }, [transcript.loading])

  return (
    <>
      <WelcomeBanner userName={userName} />
      <div className="card">
        {transcript.loading ? (
          <InfinitySpin 
          width='200'
          color="#4fa94d"
        />
        ) : (
          <>
            <h1>Transcript</h1>
            <p>{transcript.data}</p>
          </>
        )}
      </div>
    </>
  )
}

function doSomething() {
  console.log("do something")
}

export default App
