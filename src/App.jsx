// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { About } from './components/About/About';
import { Appdown } from './components/Appdown/Appdown';
import { Login } from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Hewanku from './components/Games/Hewanku';
import Kataku from './components/Games/Kataku';
import KotakMemori from './components/Games/KotakMemori';
import { Footer } from './components/Footer/Footer';
import Progressku from './components/Progress/Progressku';


import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Navbar />
        <Routes>
          {/* Homepage menampilkan semua komponen */}
          <Route
            path="/"
            element={
              <>
                <About />
                <Appdown />
                <Footer />
              </>
            }
          />

          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard setelah login */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rute untuk masing-masing game */}
          <Route path="/hewanku" element={<Hewanku />} /> 
          <Route path="/kataku" element={<Kataku />} /> 
          <Route path="/kotak-memori" element={<KotakMemori />} /> 
          <Route path="/progressku" element={<Progressku />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
