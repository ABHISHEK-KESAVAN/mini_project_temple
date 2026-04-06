import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';
import Loader from '../../components/Loader';
import './AdminPages.css';

const ManageMap = () => {
  const [content, setContent] = useState({
    templeAddress: '',
    latitude: '',
    longitude: '',
    directions: '',
    insideTempleMap: {
      image: '',
      description: ''
    }
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
      const response = await api.get('/map');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name.startsWith('insideTempleMap.')) {
      const field = e.target.name.split('.')[1];
      setContent({
        ...content,
        insideTempleMap: {
          ...content.insideTempleMap,
          [field]: e.target.value
        }
      });
    } else {
      setContent({
        ...content,
        [e.target.name]: e.target.value
      });
      if (fieldErrors[e.target.name]) setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateMap = () => {
    const err = {};
    if (!(content.templeAddress || '').trim()) err.templeAddress = 'Temple address is required';
    const lat = parseFloat(content.latitude);
    if (content.latitude !== '' && content.latitude !== undefined && (Number.isNaN(lat) || lat < -90 || lat > 90)) err.latitude = 'Latitude must be between -90 and 90';
    const lng = parseFloat(content.longitude);
    if (content.longitude !== '' && content.longitude !== undefined && (Number.isNaN(lng) || lng < -180 || lng > 180)) err.longitude = 'Longitude must be between -180 and 180';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMap()) return;
    setSaving(true);
    setMessage('');

    try {
      const submitData = {
        ...content,
        latitude: parseFloat(content.latitude),
        longitude: parseFloat(content.longitude)
      };
      await api.put('/map', submitData);
      setMessage('Map updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setFieldErrors(errMap);
      }
      setMessage(data?.message || 'Error updating map. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading map settings…" />;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Map</h1>
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
            <h2>Location Information</h2>
            <div className="form-group">
              <label>Temple Address *</label>
              <textarea
                name="templeAddress"
                value={content.templeAddress}
                onChange={handleChange}
                rows="3"
                placeholder="Full address"
              />
              {fieldErrors.templeAddress && <span className="field-error">{fieldErrors.templeAddress}</span>}
            </div>
            <div className="form-group">
              <label>Latitude *</label>
              <input
                type="number"
                name="latitude"
                value={content.latitude}
                onChange={handleChange}
                step="any"
                placeholder="e.g., 28.6139"
              />
              <small>Get coordinates from Google Maps (-90 to 90)</small>
              {fieldErrors.latitude && <span className="field-error">{fieldErrors.latitude}</span>}
            </div>
            <div className="form-group">
              <label>Longitude *</label>
              <input
                type="number"
                name="longitude"
                value={content.longitude}
                onChange={handleChange}
                step="any"
                placeholder="e.g., 77.2090"
              />
              {fieldErrors.longitude && <span className="field-error">{fieldErrors.longitude}</span>}
            </div>
            <div className="form-group">
              <label>Directions</label>
              <textarea
                name="directions"
                value={content.directions}
                onChange={handleChange}
                rows="4"
                placeholder="How to reach the temple..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Inside Temple Map</h2>
            <ImageUpload
              label="Inside Map Image"
              value={content.insideTempleMap?.image || ''}
              onChange={(url) => setContent({
                ...content,
                insideTempleMap: {
                  ...content.insideTempleMap,
                  image: url
                }
              })}
            />
            <div className="form-group">
              <label>Inside Map Description</label>
              <textarea
                name="insideTempleMap.description"
                value={content.insideTempleMap?.description || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Description of the inside temple layout..."
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

export default ManageMap;

