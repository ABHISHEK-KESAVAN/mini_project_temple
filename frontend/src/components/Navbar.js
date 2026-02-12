import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Public navbar for guests/devotees. No Admin link – admin uses direct URL /admin/login.
 */
const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🕉️ Temple
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            <Link to="/poojas" className={location.pathname === '/poojas' ? 'active' : ''}>
              Poojas
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
              Map
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

