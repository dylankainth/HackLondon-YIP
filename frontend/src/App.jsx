import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Call from "./pages/Call"

function App() {

  return (
    <>
      <main className="main-content">


        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/call" element={<Call />} />


        </Routes>

      </main>


    </>
  )
}

export default App
