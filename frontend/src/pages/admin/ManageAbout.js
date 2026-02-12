import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

const ManageAbout = () => {
  const [content, setContent] = useState({
    history: '',
    deityImportance: '',
    rules: [],
    dailyTimings: {
      morning: '',
      afternoon: '',
      evening: ''
    },
    festivals: [],
    spiritualInfo: '',
    trustInfo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/about');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name.startsWith('dailyTimings.')) {
      const field = e.target.name.split('.')[1];
      setContent({
        ...content,
        dailyTimings: {
          ...content.dailyTimings,
          [field]: e.target.value
        }
      });
    } else {
      setContent({
        ...content,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...content.rules];
    newRules[index] = { rule: value };
    setContent({ ...content, rules: newRules });
  };

  const addRule = () => {
    setContent({
      ...content,
      rules: [...content.rules, { rule: '' }]
    });
  };

  const removeRule = (index) => {
    setContent({
      ...content,
      rules: content.rules.filter((_, i) => i !== index)
    });
  };

  const handleFestivalChange = (index, field, value) => {
    const newFestivals = [...content.festivals];
    newFestivals[index] = { ...newFestivals[index], [field]: value };
    setContent({ ...content, festivals: newFestivals });
  };

  const addFestival = () => {
    setContent({
      ...content,
      festivals: [...content.festivals, { name: '', date: '', description: '' }]
    });
  };

  const removeFestival = (index) => {
    setContent({
      ...content,
      festivals: content.festivals.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/about', content);
      setMessage('About page updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating about page. Please try again.');
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
          <h1>Manage About Page</h1>
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
            <h2>History</h2>
            <div className="form-group">
              <textarea
                name="history"
                value={content.history}
                onChange={handleChange}
                rows="6"
                placeholder="Temple history..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Deity Importance</h2>
            <div className="form-group">
              <textarea
                name="deityImportance"
                value={content.deityImportance}
                onChange={handleChange}
                rows="6"
                placeholder="Importance of the deity..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Daily Timings</h2>
            <div className="form-group">
              <label>Morning</label>
              <input
                type="text"
                name="dailyTimings.morning"
                value={content.dailyTimings?.morning || ''}
                onChange={handleChange}
                placeholder="e.g., 6:00 AM - 12:00 PM"
              />
            </div>
            <div className="form-group">
              <label>Afternoon</label>
              <input
                type="text"
                name="dailyTimings.afternoon"
                value={content.dailyTimings?.afternoon || ''}
                onChange={handleChange}
                placeholder="e.g., 12:00 PM - 4:00 PM"
              />
            </div>
            <div className="form-group">
              <label>Evening</label>
              <input
                type="text"
                name="dailyTimings.evening"
                value={content.dailyTimings?.evening || ''}
                onChange={handleChange}
                placeholder="e.g., 4:00 PM - 9:00 PM"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Rules & Guidelines</h2>
            {content.rules.map((rule, index) => (
              <div key={index} className="array-item">
                <div className="form-group">
                  <input
                    type="text"
                    value={rule.rule || ''}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder="Enter rule..."
                  />
                </div>
                <button type="button" onClick={() => removeRule(index)} className="btn btn-danger">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addRule} className="btn btn-secondary">
              Add Rule
            </button>
          </div>

          <div className="form-section">
            <h2>Festivals</h2>
            {content.festivals.map((festival, index) => (
              <div key={index} className="array-item">
                <div className="form-group">
                  <label>Festival Name</label>
                  <input
                    type="text"
                    value={festival.name || ''}
                    onChange={(e) => handleFestivalChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={festival.date ? new Date(festival.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFestivalChange(index, 'date', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={festival.description || ''}
                    onChange={(e) => handleFestivalChange(index, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
                <button type="button" onClick={() => removeFestival(index)} className="btn btn-danger">
                  Remove Festival
                </button>
              </div>
            ))}
            <button type="button" onClick={addFestival} className="btn btn-secondary">
              Add Festival
            </button>
          </div>

          <div className="form-section">
            <h2>Spiritual Information</h2>
            <div className="form-group">
              <textarea
                name="spiritualInfo"
                value={content.spiritualInfo}
                onChange={handleChange}
                rows="6"
                placeholder="Spiritual information..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Trust Information</h2>
            <div className="form-group">
              <textarea
                name="trustInfo"
                value={content.trustInfo}
                onChange={handleChange}
                rows="6"
                placeholder="Trust information..."
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

export default ManageAbout;

