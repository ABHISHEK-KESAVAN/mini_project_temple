import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const response = await api.get('/contact');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching contact content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Contact & Help</h1>

        <div className="contact-grid">
          {content?.templePhone && (
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Temple Phone</h3>
              <p>{content.templePhone}</p>
            </div>
          )}

          {content?.email && (
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>{content.email}</p>
            </div>
          )}

          {content?.officeTimings && (
            <div className="contact-card">
              <div className="contact-icon">🕐</div>
              <h3>Office Timings</h3>
              <p>{content.officeTimings}</p>
            </div>
          )}

          {content?.emergencyContact && (
            <div className="contact-card">
              <div className="contact-icon">🚨</div>
              <h3>Emergency Contact</h3>
              <p>{content.emergencyContact}</p>
            </div>
          )}
        </div>

        {content?.helpInstructions && (
          <div className="help-section">
            <h2>Help Instructions</h2>
            <div className="help-content">
              <p>{content.helpInstructions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

