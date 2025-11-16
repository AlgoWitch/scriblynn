// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/SmallerComponents/AuthContext'; 
import AboutPage from './components/Pages/AboutPage';
import ContactPage from './components/Pages/ContactPage';

import Navbar from './components/SmallerComponents/Navbar';
import Footer from './components/SmallerComponents/Footer';
import Login from './components/SmallerComponents/Login';
import Signup from './components/SmallerComponents/Signup';


import HomePage from './components/Pages/HomePage';
import Feed from './components/Pages/Feed';
import Communities from './components/Pages/Communities';
import Profile from './components/Pages/Profile';
import Messages from './components/Pages/Messages';
import Resources from './components/Pages/Resources';

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* 👈 provides context to the entire app */}
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
