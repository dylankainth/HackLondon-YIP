import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Call from "./pages/Call.tsx"
import Login from "./pages/Login"
import FindPartners from "./pages/FindPartners"
import Looking from "./pages/Looking"

function App() {

  return (
    <>
      <main className="main-content">


        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/call/:roomId" element={<Call />} />
          <Route path="/looking/:searchTerm" element={<Looking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findpartners" element={<FindPartners />} />

        </Routes>

      </main>


    </>
  )
}

export default App
