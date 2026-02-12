import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

const ManageContact = () => {
  const [content, setContent] = useState({
    templePhone: '',
    email: '',
    officeTimings: '',
    emergencyContact: '',
    helpInstructions: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/contact');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContent({
      ...content,
      [e.target.name]: e.target.value
    });
    if (fieldErrors[e.target.name]) setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateContact = () => {
    const err = {};
    const email = (content.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Enter a valid email address';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateContact()) return;
    setSaving(true);
    setMessage('');

    try {
      await api.put('/contact', content);
      setMessage('Contact page updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setFieldErrors(errMap);
      }
      setMessage(data?.message || 'Error updating contact page. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Contact</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label>Temple Phone</label>
              <input
                type="tel"
                name="templePhone"
                value={content.templePhone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={content.email}
                onChange={handleChange}
                placeholder="temple@example.com"
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>Office Timings</label>
              <input
                type="text"
                name="officeTimings"
                value={content.officeTimings}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 6:00 PM"
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={content.emergencyContact}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Help Instructions</label>
              <textarea
                name="helpInstructions"
                value={content.helpInstructions}
                onChange={handleChange}
                rows="6"
                placeholder="Instructions for devotees..."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageContact;

