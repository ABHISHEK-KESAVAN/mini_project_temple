import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './Navbar.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getImageSrc = (url) => (url && url.startsWith('/uploads')) ? `${API_BASE.replace(/\/api\/?$/, '')}${url}` : url;

/**
 * Public navbar: logo (from Admin) left, nav links right. No Admin link – admin uses /admin/login.
 */
const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [homeContent, setHomeContent] = useState(null);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      api.get('/home').then((res) => setHomeContent(res.data)).catch(() => {});
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const templeName = homeContent?.templeName || 'Temple';
  const templeLogo = homeContent?.templeLogo;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          {templeLogo ? (
            <>
              <img src={getImageSrc(templeLogo)} alt={templeName} className="navbar-logo-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.classList.remove('navbar-fallback-hidden'); }} />
              <span className="navbar-logo-fallback navbar-fallback-hidden">🕉️ {templeName}</span>
            </>
          ) : (
            <span className="navbar-logo-fallback">🕉️ {templeName}</span>
          )}
        </Link>
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/poojas" className={location.pathname === '/poojas' ? 'active' : ''} onClick={closeMenu}>
              Poojas
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''} onClick={closeMenu}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/map" className={location.pathname === '/map' ? 'active' : ''} onClick={closeMenu}>
              Map
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

