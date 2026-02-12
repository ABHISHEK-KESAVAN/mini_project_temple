import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Poojas from './pages/Poojas';
import Token from './pages/Token';
import Map from './pages/Map';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHome from './pages/admin/ManageHome';
import ManagePoojas from './pages/admin/ManagePoojas';
import ManageTokens from './pages/admin/ManageTokens';
import ManageMap from './pages/admin/ManageMap';
import ManageAbout from './pages/admin/ManageAbout';
import ManageContact from './pages/admin/ManageContact';
import ManageTheme from './pages/admin/ManageTheme';
import ManageTokenSettings from './pages/admin/ManageTokenSettings';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/poojas" element={<><Navbar /><Poojas /></>} />
        <Route path="/token" element={<><Navbar /><Token /></>} />
        <Route path="/map" element={<><Navbar /><Map /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/gallery" element={<><Navbar /><Gallery /></>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/home" element={<PrivateRoute><ManageHome /></PrivateRoute>} />
        <Route path="/admin/poojas" element={<PrivateRoute><ManagePoojas /></PrivateRoute>} />
        <Route path="/admin/tokens" element={<PrivateRoute><ManageTokens /></PrivateRoute>} />
        <Route path="/admin/token-settings" element={<PrivateRoute><ManageTokenSettings /></PrivateRoute>} />
        <Route path="/admin/map" element={<PrivateRoute><ManageMap /></PrivateRoute>} />
        <Route path="/admin/about" element={<PrivateRoute><ManageAbout /></PrivateRoute>} />
        <Route path="/admin/contact" element={<PrivateRoute><ManageContact /></PrivateRoute>} />
        <Route path="/admin/theme" element={<PrivateRoute><ManageTheme /></PrivateRoute>} />
      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

