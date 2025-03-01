import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Call from "./pages/Call"
import RoomPage from './pages/Room/RoomPage'

function App() {

  return (
    <>
      <main className="main-content">


        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/call" element={<Call />} />
          <Route path="/room/:nickname/:roomId" element={<RoomPage />} />

        </Routes>

      </main>


    </>
  )
}

export default App
