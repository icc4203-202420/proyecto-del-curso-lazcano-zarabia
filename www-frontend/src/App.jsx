import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.jsx';
import BarsIndex from './components/BarsIndex.jsx';
import BarEvents from './components/BarEvents.jsx';
import BeersIndex from './components/BeersIndex.jsx';
import UserSearch from './components/UserSearch.jsx';
import './App.css'; 

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bars" element={<BarsIndex />} />
        <Route path="/bars/:id/events" element={<BarEvents />} />
        <Route path="/beers" element={<BeersIndex />} />
        <Route path="/users" element={<UserSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
