import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import './AdminPages.css';

const ManageFooter = () => {
  const [content, setContent] = useState({
    copyrightText: '© 2024 Temple. All rights reserved.',
    templeName: '',
    address: '',
    phone: '',
    email: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    quickLinks: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [newQuickLink, setNewQuickLink] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/footer');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching footer content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setContent({
        ...content,
        socialLinks: {
          ...content.socialLinks,
          [socialKey]: value
        }
      });
    } else {
      setContent({
        ...content,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddQuickLink = () => {
    if (newQuickLink.trim() && !content.quickLinks.includes(newQuickLink.trim())) {
      setContent({
        ...content,
        quickLinks: [...content.quickLinks, newQuickLink.trim()]
      });
      setNewQuickLink('');
    }
  };

  const handleRemoveQuickLink = (index) => {
    setContent({
      ...content,
      quickLinks: content.quickLinks.filter((_, i) => i !== index)
    });
  };

  const validateFooter = () => {
    const err = {};
    const email = (content.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Enter a valid email address';
    }
    
    // Validate social links are URLs if provided
    Object.keys(content.socialLinks).forEach(key => {
      const url = content.socialLinks[key];
      if (url && url !== '' && !/^https?:\/\/.+/.test(url)) {
        err[`socialLinks.${key}`] = 'Must be a valid URL starting with http:// or https://';
      }
    });
    
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFooter()) return;
    setSaving(true);
    setMessage('');

    try {
      await api.put('/footer', content);
      setMessage('Footer updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setFieldErrors(errMap);
      }
      setMessage(data?.message || 'Error updating footer. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading footer settings…" />;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Footer</h1>
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
            <h2>Footer Settings</h2>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={content.isActive}
                  onChange={handleChange}
                />
                {' '}Show Footer
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Temple Information</h2>
            <div className="form-group">
              <label>Temple Name</label>
              <input
                type="text"
                name="templeName"
                value={content.templeName}
                onChange={handleChange}
                placeholder="Temple Name"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={content.address}
                onChange={handleChange}
                rows="3"
                placeholder="Temple address..."
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
          </div>

          <div className="form-section">
            <h2>Social Media Links</h2>
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                name="socialLinks.facebook"
                value={content.socialLinks.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
              />
              {fieldErrors['socialLinks.facebook'] && (
                <span className="field-error">{fieldErrors['socialLinks.facebook']}</span>
              )}
            </div>
            <div className="form-group">
              <label>Twitter URL</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={content.socialLinks.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourhandle"
              />
              {fieldErrors['socialLinks.twitter'] && (
                <span className="field-error">{fieldErrors['socialLinks.twitter']}</span>
              )}
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                name="socialLinks.instagram"
                value={content.socialLinks.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourhandle"
              />
              {fieldErrors['socialLinks.instagram'] && (
                <span className="field-error">{fieldErrors['socialLinks.instagram']}</span>
              )}
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
              {fieldErrors['socialLinks.youtube'] && (
                <span className="field-error">{fieldErrors['socialLinks.youtube']}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Quick Links</h2>
            <div className="form-group">
              <label>Add Quick Link</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newQuickLink}
                  onChange={(e) => setNewQuickLink(e.target.value)}
                  placeholder="Link text (e.g., 'About Us')"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuickLink())}
                />
                <button type="button" onClick={handleAddQuickLink} className="btn btn-secondary">
                  Add
                </button>
              </div>
            </div>
            {content.quickLinks.length > 0 && (
              <div className="form-group">
                <label>Current Quick Links</label>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {content.quickLinks.map((link, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#f5f5f5', marginBottom: '0.5rem', borderRadius: '4px' }}>
                      <span>{link}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickLink(index)}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Copyright Text</h2>
            <div className="form-group">
              <label>Copyright Text</label>
              <input
                type="text"
                name="copyrightText"
                value={content.copyrightText}
                onChange={handleChange}
                placeholder="© 2024 Temple. All rights reserved."
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

export default ManageFooter;
