import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import './AdminPages.css';

const INITIAL_CONTENT = {
  heroTitle: '',
  heroSubtitle: '',
  address: '',
  phone: '',
  templePhone: '',
  email: '',
  officeTimings: '',
  emergencyContact: '',
  latitude: '',
  longitude: '',
  directions: '',
  helpInstructions: '',
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  }
};

const ManageContact = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);
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
      setContent({
        ...INITIAL_CONTENT,
        ...response.data,
        socialLinks: {
          ...INITIAL_CONTENT.socialLinks,
          ...(response.data?.socialLinks || {})
        },
        latitude: response.data?.latitude ?? '',
        longitude: response.data?.longitude ?? ''
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setContent((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value
        }
      }));
    } else {
      setContent((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateContact = () => {
    const err = {};
    const email = (content.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Enter a valid email address';
    }

    const latitude = content.latitude === '' ? null : Number(content.latitude);
    if (content.latitude !== '' && (Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
      err.latitude = 'Latitude must be between -90 and 90';
    }

    const longitude = content.longitude === '' ? null : Number(content.longitude);
    if (content.longitude !== '' && (Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
      err.longitude = 'Longitude must be between -180 and 180';
    }

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateContact()) return;

    setSaving(true);
    setMessage('');

    try {
      await api.put('/contact', {
        ...content,
        phone: content.phone || content.templePhone,
        templePhone: content.templePhone || content.phone,
        latitude: content.latitude === '' ? '' : Number(content.latitude),
        longitude: content.longitude === '' ? '' : Number(content.longitude)
      });
      setMessage('Contact page updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach((entry) => {
          errMap[entry.field] = entry.message;
        });
        setFieldErrors(errMap);
      }
      setMessage(data?.message || 'Error updating contact page. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading contact settings..." />;
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
            <h2>Hero Content</h2>
            <div className="form-group">
              <label>Hero Title</label>
              <input
                type="text"
                name="heroTitle"
                value={content.heroTitle}
                onChange={handleChange}
                placeholder="Contact the Temple"
              />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <input
                type="text"
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleChange}
                placeholder="Reach us for darshan timings, guidance, and temple visits"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={content.address}
                onChange={handleChange}
                rows="3"
                placeholder="Temple address"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={content.phone}
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
          </div>

          <div className="form-section">
            <h2>Map & Directions</h2>
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={content.latitude}
                onChange={handleChange}
                placeholder="12.9716"
              />
              {fieldErrors.latitude && <span className="field-error">{fieldErrors.latitude}</span>}
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={content.longitude}
                onChange={handleChange}
                placeholder="77.5946"
              />
              {fieldErrors.longitude && <span className="field-error">{fieldErrors.longitude}</span>}
            </div>
            <div className="form-group">
              <label>Directions</label>
              <textarea
                name="directions"
                value={content.directions}
                onChange={handleChange}
                rows="5"
                placeholder="Share landmarks, parking info, and route guidance..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Help & Social Links</h2>
            <div className="form-group">
              <label>Help Instructions</label>
              <textarea
                name="helpInstructions"
                value={content.helpInstructions}
                onChange={handleChange}
                rows="5"
                placeholder="Instructions for devotees..."
              />
            </div>
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                name="socialLinks.facebook"
                value={content.socialLinks.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="form-group">
              <label>Twitter URL</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={content.socialLinks.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourpage"
              />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                name="socialLinks.instagram"
                value={content.socialLinks.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div className="form-group">
              <label>YouTube URL</label>
              <input
                type="url"
                name="socialLinks.youtube"
                value={content.socialLinks.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/yourchannel"
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
