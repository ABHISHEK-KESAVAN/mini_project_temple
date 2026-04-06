import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Poojas from './pages/Poojas';
import Token from './pages/Token';
import TokenView from './pages/TokenView';
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
import ManageFooter from './pages/admin/ManageFooter';
import ManageTheme from './pages/admin/ManageTheme';
import ManageTokenSettings from './pages/admin/ManageTokenSettings';
import PrivateRoute from './components/PrivateRoute';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/poojas" element={<><Navbar /><Poojas /><Footer /></>} />
        <Route path="/token" element={<><Navbar /><Token /><Footer /></>} />
        <Route path="/token/view/:id" element={<><Navbar /><TokenView /><Footer /></>} />
        <Route path="/map" element={<Navigate to="/contact" replace />} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />
        
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
        <Route path="/admin/footer" element={<PrivateRoute><ManageFooter /></PrivateRoute>} />
        <Route path="/admin/theme" element={<PrivateRoute><ManageTheme /></PrivateRoute>} />
      </Routes>
      <Chatbot />
      </Router>
    </ThemeProvider>
  );
}

export default App;

