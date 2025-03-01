import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Call from "./pages/Call.tsx"

function App() {

  return (
    <>
      <main className="main-content">


        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/call/:nickname/:roomId" element={<Call />} />

        </Routes>

      </main>


    </>
  )
}

export default App
