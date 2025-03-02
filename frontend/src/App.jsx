import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TimeProvider } from './context/TimeContext'; // Import TimeProvider
import Home from './pages/Home';
import Call from './pages/Call.tsx';
import Login from './pages/Login';
import FindPartners from './pages/FindPartners';
import Looking from './pages/Looking';
import CheckInTime from './partials/CheckinAsk';
import SubjectSearch from './partials/SubjectSearch';

function App() {
  return (
    <TimeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/call/:roomId" element={<Call />} />
          <Route path="/looking/:searchTerm" element={<Looking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findpartners" element={<FindPartners />} />
          <Route path="/checkin" element={<CheckInTime />} />
          <Route path="/subjectsearch" element={<SubjectSearch />} />
        </Routes>
      </Router>
    </TimeProvider>
  );
}

export default App;
