import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Call from "./pages/Call.tsx"
import Login from "./pages/Login"
import FindPartners from "./pages/FindPartners"

function App() {

  return (
    <>
      <main className="main-content">


        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/call/:nickname/:roomId" element={<Call />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findpartners" element={<FindPartners />} />

        </Routes>

      </main>


    </>
  )
}

export default App
