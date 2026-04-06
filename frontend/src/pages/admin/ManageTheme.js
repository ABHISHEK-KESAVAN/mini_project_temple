import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useTheme } from '../../components/ThemeProvider';
import ImageUpload from '../../components/ImageUpload';
import Loader from '../../components/Loader';
import './AdminPages.css';

const ManageTheme = () => {
  const { theme, setTheme, fetchTheme } = useTheme();
  const [formData, setFormData] = useState(theme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchThemeData();
  }, []);

  useEffect(() => {
    setFormData(theme);
  }, [theme]);

  const fetchThemeData = async () => {
    try {
      const response = await api.get('/theme');
      const apiTheme = response.data || {};

      const defaultTheme = {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#4CAF50',
        textColor: '#333333',
        backgroundColor: '#f5f5f5',
        backgroundImage: '',
        headerGradientStart: '#667eea',
        headerGradientEnd: '#764ba2',
        headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        navbarBackground: '#1a1a1a',
        buttonPrimary: '#4CAF50',
        buttonSecondary: '#2196F3',
        cardStyle: 'normal',
        cardShape: 'round-rectangle',
        fontFamily: 'Georgia, "Times New Roman", serif'
      };

      const headerGradientStart = apiTheme.headerGradientStart || defaultTheme.headerGradientStart;
      const headerGradientEnd = apiTheme.headerGradientEnd || defaultTheme.headerGradientEnd;

      const normalizedTheme = {
        ...defaultTheme,
        ...apiTheme,
        headerGradientStart,
        headerGradientEnd,
        headerBackground:
          apiTheme.headerBackground ||
          `linear-gradient(135deg, ${headerGradientStart} 0%, ${headerGradientEnd} 100%)`
      };

      setFormData(normalizedTheme);
      setTheme(normalizedTheme);
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };

    // Keep header gradient and background in sync
    if (name === 'headerGradientStart' || name === 'headerGradientEnd') {
      const start = name === 'headerGradientStart' ? value : (newData.headerGradientStart || '#667eea');
      const end = name === 'headerGradientEnd' ? value : (newData.headerGradientEnd || '#764ba2');
      newData.headerBackground = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
    }

    setFormData(newData);
    setTheme(newData); // Update preview immediately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/theme', formData);
      setMessage('Theme updated successfully!');
      fetchTheme(); // Refresh theme
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating theme. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    const defaultTheme = {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#4CAF50',
      textColor: '#333333',
      backgroundColor: '#f5f5f5',
      backgroundImage: '',
      headerGradientStart: '#667eea',
      headerGradientEnd: '#764ba2',
      headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      navbarBackground: '#1a1a1a',
      buttonPrimary: '#4CAF50',
      buttonSecondary: '#2196F3',
      cardStyle: 'normal',
      cardShape: 'round-rectangle',
      fontFamily: 'Georgia, "Times New Roman", serif'
    };
    setFormData(defaultTheme);
    setTheme(defaultTheme);
  };

  const THEME_PRESETS = [
    {
      id: 'classic-saffron',
      label: 'Classic saffron & maroon',
      theme: {
        primaryColor: '#D97706',
        secondaryColor: '#7C2D12',
        accentColor: '#FBBF24',
        textColor: '#f5f5f5',
        backgroundColor: '#1C1917',
        backgroundImage: '',
        headerGradientStart: '#F97316',
        headerGradientEnd: '#7C2D12',
        headerBackground: 'linear-gradient(135deg, #F97316 0%, #7C2D12 100%)',
        navbarBackground: '#111827',
        buttonPrimary: '#F97316',
        buttonSecondary: '#4B5563',
        cardStyle: 'glass',
        cardShape: 'round-rectangle',
        fontFamily: 'Georgia, "Times New Roman", serif'
      }
    },
    {
      id: 'deep-purple-temple',
      label: 'Deep purple temple',
      theme: {
        primaryColor: '#4C1D95',
        secondaryColor: '#7C3AED',
        accentColor: '#F59E0B',
        textColor: '#E5E7EB',
        backgroundColor: '#020617',
        backgroundImage: '',
        headerGradientStart: '#581C87',
        headerGradientEnd: '#1E3A8A',
        headerBackground: 'linear-gradient(135deg, #581C87 0%, #1E3A8A 100%)',
        navbarBackground: '#0B1120',
        buttonPrimary: '#7C3AED',
        buttonSecondary: '#1D4ED8',
        cardStyle: 'glass',
        cardShape: 'round-rectangle',
        fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
      }
    },
    {
      id: 'festive-daylight',
      label: 'Festive daylight',
      theme: {
        primaryColor: '#DC2626',
        secondaryColor: '#F97316',
        accentColor: '#16A34A',
        textColor: '#1F2933',
        backgroundColor: '#FFF7ED',
        backgroundImage: '',
        headerGradientStart: '#F97316',
        headerGradientEnd: '#DC2626',
        headerBackground: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
        navbarBackground: '#7F1D1D',
        buttonPrimary: '#DC2626',
        buttonSecondary: '#16A34A',
        cardStyle: 'normal',
        cardShape: 'round-rectangle',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }
    }
  ];

  const applyPreset = (presetTheme) => {
    const merged = {
      ...formData,
      ...presetTheme
    };
    setFormData(merged);
    setTheme(merged);
  };

  const FONT_OPTIONS = [
    { label: 'Traditional (serif – temple feel)', value: 'Georgia, "Times New Roman", serif' },
    { label: 'Modern (sans-serif)', value: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' },
    { label: 'Classical (Times)', value: 'Times, "Times New Roman", serif' },
    { label: 'Clean (system)', value: 'system-ui, -apple-system, sans-serif' },
    { label: 'Elegant (Garamond-style)', value: 'Cambria, "Hoefler Text", serif' }
  ];

  if (loading) {
    return <Loader label="Loading theme settings…" />;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Theme & Colors</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="theme-preview-section">
          <h2>Live Preview</h2>
          <div className="preview-box" style={{ background: formData.headerBackground }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}
              >
                🕉️
              </div>
              <h3 style={{ color: 'white', margin: 0 }}>Temple Name</h3>
            </div>
          </div>
          <div className="preview-buttons" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button 
              style={{ 
                background: formData.buttonPrimary, 
                color: 'white', 
                padding: '0.5rem 1rem', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              Primary Button
            </button>
            <button 
              style={{ 
                background: formData.buttonSecondary, 
                color: 'white', 
                padding: '0.5rem 1rem', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              Secondary Button
            </button>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <p className="form-hint">Try a ready-made theme as a starting point. You can still change any color after applying.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => applyPreset(preset.theme)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h2>Card style & shape</h2>
            <p className="form-hint">Applies to blocks, cards, forms, and panels across the site.</p>
            <div className="form-group">
              <label>Card style</label>
              <select
                name="cardStyle"
                value={formData.cardStyle || 'normal'}
                onChange={handleChange}
              >
                <option value="normal">Normal (solid)</option>
                <option value="glass">Glass (frosted)</option>
                <option value="metallic">Metallic</option>
                <option value="wood">Wood texture</option>
              </select>
            </div>
            <div className="form-group">
              <label>Card shape</label>
              <select
                name="cardShape"
                value={formData.cardShape || 'round-rectangle'}
                onChange={handleChange}
              >
                <option value="round-rectangle">Round corner rectangle</option>
                <option value="parallelogram">Parallelogram</option>
                <option value="rectangle">Rectangle (sharp)</option>
                <option value="square">Square (sharp)</option>
                <option value="pill">Pill (capsule)</option>
                <option value="circle">Circle (for small cards)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Font</h2>
            <div className="form-group">
              <label>Site font</label>
              <select
                name="fontFamily"
                value={formData.fontFamily || FONT_OPTIONS[0].value}
                onChange={handleChange}
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Header Colors</h2>
            <div className="color-grid">
              <div className="form-group">
                <label>Header Gradient Start</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="headerGradientStart"
                    value={formData.headerGradientStart || '#667eea'}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="headerGradientStart"
                    value={formData.headerGradientStart || '#667eea'}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Header Gradient End</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="headerGradientEnd"
                    value={formData.headerGradientEnd || '#764ba2'}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="headerGradientEnd"
                    value={formData.headerGradientEnd || '#764ba2'}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Header Background (Gradient or Color)</label>
              <input
                type="text"
                name="headerBackground"
                value={formData.headerBackground}
                onChange={handleChange}
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%) or #667eea"
              />
              <small>Use CSS gradient or single color (e.g., #667eea)</small>
            </div>
          </div>

          <div className="form-section">
            <h2>Primary Colors</h2>
            <div className="color-grid">
              <div className="form-group">
                <label>Primary Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Secondary Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Accent Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Button Colors</h2>
            <div className="color-grid">
              <div className="form-group">
                <label>Primary Button Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="buttonPrimary"
                    value={formData.buttonPrimary}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="buttonPrimary"
                    value={formData.buttonPrimary}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Secondary Button Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="buttonSecondary"
                    value={formData.buttonSecondary}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="buttonSecondary"
                    value={formData.buttonSecondary}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Background & Text Colors</h2>
            <div className="color-grid">
              <div className="form-group">
                <label>Background Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Text Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Navbar Background</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="navbarBackground"
                    value={formData.navbarBackground}
                    onChange={handleChange}
                    style={{ width: '60px', height: '40px' }}
                  />
                  <input
                    type="text"
                    name="navbarBackground"
                    value={formData.navbarBackground}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
            <ImageUpload
              label="Background Image (optional)"
              value={formData.backgroundImage || ''}
              onChange={(url) => {
                const newData = { ...formData, backgroundImage: url };
                setFormData(newData);
                setTheme(newData);
              }}
            />
            <small>Used behind glass cards and page background. Leave empty for solid background color only.</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Theme'}
            </button>
            <button type="button" onClick={resetToDefault} className="btn btn-secondary">
              Reset to Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageTheme;

