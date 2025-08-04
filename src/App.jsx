// App.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { About } from './components/About/About';
import { Appdown } from './components/Appdown/Appdown';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Footer } from './components/Footer/Footer';
import { Home } from './components/Home/Home';
import { MealPlan } from './components/MealPlan/MealPlan';
import { Add } from './components/Add/Add';
import { AddActivity } from './components/AddActivity/AddActivity';
import { AddFood } from './components/AddFood/AddFood';
import { Profile } from './components/Profile/Profile';
import { EditProfile } from './components/EditProfile/EditProfile';
import { Evaluation } from './components/Evaluation/Evaluation';

import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Routes>
          {/* Halaman utama (landing) */}
          <Route
            path="/"
            element={
              <>
                <About />
                <Appdown />
                <Footer />
                <Link to="/add/food">
                  <button>Ke Halaman Tambah Makanan</button>
                </Link>
              </>
            }
          />

          {/* Login dan Register TIDAK menampilkan Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Halaman setelah login - menampilkan Navbar */}
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/meal-plan"
            element={
              <>
                <Navbar />
                <MealPlan />
              </>
            }
          />
          <Route
            path="/add"
            element={
              <>
                <Navbar />
                <Add />
              </>
            }
          />
          <Route
            path="/aktivitas"
            element={
              <>
                <Navbar />
                <AddActivity />
              </>
            }
          />
          <Route
            path="/add/food"
            element={
              <>
                <Navbar />
                <AddFood />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <>
                <Navbar />
                <EditProfile />
              </>
            }
          />
          <Route
            path="/evaluation"
            element={
              <>
                <Navbar />
                <Evaluation />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
