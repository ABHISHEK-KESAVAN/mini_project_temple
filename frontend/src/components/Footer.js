import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Footer.css';

const Footer = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const response = await api.get('/footer');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching footer content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !content || !content.isActive) {
    return null;
  }

  const { copyrightText, templeName, address, phone, email, socialLinks, quickLinks } = content;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Temple Info Section */}
          {(templeName || address || phone || email) && (
            <div className="footer-section">
              <h3>{templeName || 'Temple'}</h3>
              {address && <p className="footer-address">{address}</p>}
              {phone && (
                <p className="footer-contact">
                  <span>📞</span> {phone}
                </p>
              )}
              {email && (
                <p className="footer-contact">
                  <span>✉️</span> <a href={`mailto:${email}`}>{email}</a>
                </p>
              )}
            </div>
          )}

          {/* Quick Links Section */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.toLowerCase().replace(/\s+/g, '-')}>{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Links */}
          <div className="footer-section">
            <h3>Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/poojas">Poojas</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          {(socialLinks?.facebook || socialLinks?.twitter || socialLinks?.instagram || socialLinks?.youtube) && (
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    📘 Facebook
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    🐦 Twitter
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    📷 Instagram
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    ▶️ YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>{copyrightText || '© 2024 Temple. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
