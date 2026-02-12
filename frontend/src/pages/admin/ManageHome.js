import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const ManageHome = () => {
  const [content, setContent] = useState({
    templeName: '',
    templeLogo: '',
    welcomeMessage: '',
    bannerAspectRatio: '16/9',
    aboutTeaser: '',
    banners: [],
    announcements: [],
    highlightCards: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/home');
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
  };

  const handleBannerChange = (index, field, value) => {
    const newBanners = [...content.banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setContent({ ...content, banners: newBanners });
  };

  const addBanner = () => {
    setContent({
      ...content,
      banners: [...content.banners, { image: '', title: '', description: '' }]
    });
  };

  const removeBanner = (index) => {
    setContent({
      ...content,
      banners: content.banners.filter((_, i) => i !== index)
    });
  };

  const handleAnnouncementChange = (index, field, value) => {
    const newAnnouncements = [...content.announcements];
    newAnnouncements[index] = { ...newAnnouncements[index], [field]: value };
    setContent({ ...content, announcements: newAnnouncements });
  };

  const addAnnouncement = () => {
    setContent({
      ...content,
      announcements: [...content.announcements, { title: '', message: '', date: '', isActive: true }]
    });
  };

  const removeAnnouncement = (index) => {
    setContent({
      ...content,
      announcements: content.announcements.filter((_, i) => i !== index)
    });
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...content.highlightCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setContent({ ...content, highlightCards: newCards });
  };

  const addCard = () => {
    setContent({
      ...content,
      highlightCards: [...content.highlightCards, { title: '', description: '', icon: '', link: '' }]
    });
  };

  const removeCard = (index) => {
    setContent({
      ...content,
      highlightCards: content.highlightCards.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/home', content);
      setMessage('Home page updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating home page. Please try again.');
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
          <h1>Manage Home Page</h1>
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
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Temple Name</label>
              <input
                type="text"
                name="templeName"
                value={content.templeName}
                onChange={handleChange}
              />
            </div>
            <ImageUpload
              label="Temple Logo"
              value={content.templeLogo}
              onChange={(url) => setContent({ ...content, templeLogo: url })}
            />
            <div className="form-group">
              <label>Welcome Message</label>
              <textarea
                name="welcomeMessage"
                value={content.welcomeMessage}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Image ratio (Slider & Gallery)</h2>
            <p className="form-hint">All banner images use the same ratio on the home slider and gallery page. Choose one ratio for a consistent look.</p>
            <div className="form-group">
              <label>Aspect ratio</label>
              <select
                name="bannerAspectRatio"
                value={content.bannerAspectRatio || '16/9'}
                onChange={handleChange}
              >
                <option value="16/9">16:9 (wide)</option>
                <option value="4/3">4:3</option>
                <option value="1">1:1 (square)</option>
                <option value="3/2">3:2</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>About teaser (Home page)</h2>
            <p className="form-hint">Short text shown on the home page. &quot;See more About&quot; links to the full About page.</p>
            <div className="form-group">
              <label>About teaser text</label>
              <textarea
                name="aboutTeaser"
                value={content.aboutTeaser || ''}
                onChange={handleChange}
                rows="3"
                placeholder="A brief intro about the temple..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Banners (Slider & Gallery)</h2>
            <p className="form-hint">These images appear in the home slider. Clicking a slide takes visitors to the Gallery. Same ratio above applies to all.</p>
            {content.banners.map((banner, index) => (
              <div key={index} className="array-item">
                <ImageUpload
                  label="Banner Image"
                  value={banner.image || ''}
                  onChange={(url) => handleBannerChange(index, 'image', url)}
                />
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={banner.title || ''}
                    onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={banner.description || ''}
                    onChange={(e) => handleBannerChange(index, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
                <button type="button" onClick={() => removeBanner(index)} className="btn btn-danger">
                  Remove Banner
                </button>
              </div>
            ))}
            <button type="button" onClick={addBanner} className="btn btn-secondary">
              Add Banner
            </button>
          </div>

          <div className="form-section">
            <h2>Announcements</h2>
            {content.announcements.map((announcement, index) => (
              <div key={index} className="array-item">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={announcement.title || ''}
                    onChange={(e) => handleAnnouncementChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={announcement.message || ''}
                    onChange={(e) => handleAnnouncementChange(index, 'message', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={announcement.date ? new Date(announcement.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleAnnouncementChange(index, 'date', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={announcement.isActive !== false}
                      onChange={(e) => handleAnnouncementChange(index, 'isActive', e.target.checked)}
                    />
                    Active
                  </label>
                </div>
                <button type="button" onClick={() => removeAnnouncement(index)} className="btn btn-danger">
                  Remove Announcement
                </button>
              </div>
            ))}
            <button type="button" onClick={addAnnouncement} className="btn btn-secondary">
              Add Announcement
            </button>
          </div>

          <div className="form-section">
            <h2>Highlight Cards</h2>
            {content.highlightCards.map((card, index) => (
              <div key={index} className="array-item">
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={card.icon || ''}
                    onChange={(e) => handleCardChange(index, 'icon', e.target.value)}
                    placeholder="📿"
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={card.description || ''}
                    onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Link</label>
                  <input
                    type="text"
                    value={card.link || ''}
                    onChange={(e) => handleCardChange(index, 'link', e.target.value)}
                    placeholder="/about"
                  />
                </div>
                <button type="button" onClick={() => removeCard(index)} className="btn btn-danger">
                  Remove Card
                </button>
              </div>
            ))}
            <button type="button" onClick={addCard} className="btn btn-secondary">
              Add Card
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageHome;

