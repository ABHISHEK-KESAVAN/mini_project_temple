import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

const ManageTokenSettings = () => {
  const [settings, setSettings] = useState({
    limitType: 'day',
    limitValue: 500,
    expiryMinutes: 120
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/token');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    const limit = Number(settings.limitValue);
    if (Number.isNaN(limit) || limit < 1 || limit > 100000) {
      err.limitValue = 'Limit must be between 1 and 100000';
    }
    const expiry = Number(settings.expiryMinutes);
    if (Number.isNaN(expiry) || expiry < 5 || expiry > 10080) {
      err.expiryMinutes = 'Expiry must be between 5 and 10080 minutes (7 days)';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'limitValue' || name === 'expiryMinutes' ? value : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage('');
    try {
      await api.put('/settings/token', {
        limitType: settings.limitType,
        limitValue: Number(settings.limitValue),
        expiryMinutes: Number(settings.expiryMinutes)
      });
      setMessage('Token settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setErrors(errMap);
      }
      setMessage(data?.message || 'Failed to save settings.');
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
          <h1>Token Limit & Expiry</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${message.includes('Failed') || message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="form-section" style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
            Set how many tokens can be generated and how long each token stays valid. If a devotee does not show up before the token expires, they must generate a new token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h2>Token Limit</h2>
            <div className="form-group">
              <label>Limit by</label>
              <select
                name="limitType"
                value={settings.limitType}
                onChange={handleChange}
              >
                <option value="day">Per day (resets at midnight)</option>
                <option value="hour">Per hour (rolling window)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Maximum tokens {settings.limitType === 'day' ? 'per day' : 'per hour'} *</label>
              <input
                type="number"
                name="limitValue"
                value={settings.limitValue}
                onChange={handleChange}
                min={1}
                max={100000}
              />
              {errors.limitValue && <span className="field-error">{errors.limitValue}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Token Expiry</h2>
            <div className="form-group">
              <label>Token valid for (minutes) *</label>
              <input
                type="number"
                name="expiryMinutes"
                value={settings.expiryMinutes}
                onChange={handleChange}
                min={5}
                max={10080}
                placeholder="120"
              />
              <small>After this time, the token expires. Devotee must generate a new token if they did not show up. (5 min – 7 days)</small>
              {errors.expiryMinutes && <span className="field-error">{errors.expiryMinutes}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageTokenSettings;
