import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Contact.css';

const SOCIAL_META = {
  facebook: { label: 'Facebook', icon: 'f' },
  twitter: { label: 'Twitter', icon: 'X' },
  instagram: { label: 'Instagram', icon: '◎' },
  youtube: { label: 'YouTube', icon: '▶' }
};

const Contact = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

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

  const mapSrc = useMemo(() => {
    if (content?.latitude === null || content?.longitude === null || content?.latitude === undefined || content?.longitude === undefined) {
      return '';
    }

    return `https://maps.google.com/maps?q=${content.latitude},${content.longitude}&z=15&output=embed`;
  }, [content?.latitude, content?.longitude]);

  const directionsList = useMemo(() => {
    const value = (content?.directions || '').trim();
    if (!value) return [];

    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [content?.directions]);

  const socialEntries = useMemo(
    () => Object.entries(content?.socialLinks || {}).filter(([, url]) => url),
    [content?.socialLinks]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      setFormStatus('Please enter your name and message.');
      return;
    }

    setFormStatus('Your message is ready. Please call or email the temple team using the details on this page.');
    setFormData({ name: '', phone: '', message: '' });
  };

  if (loading) {
    return <Loader label="Loading contact info..." />;
  }

  const infoCards = [
    {
      key: 'address',
      title: 'Address',
      value: content?.address,
      icon: '📍',
      render: (value) => <p>{value}</p>
    },
    {
      key: 'phone',
      title: 'Phone',
      value: content?.phone,
      icon: '📞',
      render: (value) => <a href={`tel:${value}`}>{value}</a>
    },
    {
      key: 'email',
      title: 'Email',
      value: content?.email,
      icon: '✉',
      render: (value) => <a href={`mailto:${value}`}>{value}</a>
    },
    {
      key: 'officeTimings',
      title: 'Timings',
      value: content?.officeTimings,
      icon: '🕰',
      render: (value) => <p>{value}</p>
    }
  ].filter((card) => card.value);

  return (
    <div className="contact-page page-fade-in">
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content container">
          {content?.heroTitle && <p className="contact-hero-kicker">Connect</p>}
          <h1>{content?.heroTitle}</h1>
          {content?.heroSubtitle && <p className="contact-hero-subtitle">{content.heroSubtitle}</p>}
        </div>
      </section>

      <div className="contact-shell container">
        {infoCards.length > 0 && (
          <section className="contact-card-grid">
            {infoCards.map((card) => (
              <article key={card.key} className="contact-info-card">
                <div className="contact-card-icon" aria-hidden="true">{card.icon}</div>
                <h2>{card.title}</h2>
                <div className="contact-card-value">{card.render(card.value)}</div>
              </article>
            ))}
          </section>
        )}

        <section className="contact-main-grid">
          <div className="contact-panel">
            <div className="panel-header">
              <span className="panel-icon">🧭</span>
              <div>
                <h2>Directions</h2>
                <p>{content?.address}</p>
              </div>
            </div>
            {directionsList.length > 0 ? (
              <ol className="directions-list">
                {directionsList.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className="panel-empty">Directions will appear here once added from the admin panel.</p>
            )}

            {content?.emergencyContact && (
              <div className="contact-highlight">
                <strong>Emergency Contact</strong>
                <a href={`tel:${content.emergencyContact}`}>{content.emergencyContact}</a>
              </div>
            )}

            {content?.helpInstructions && (
              <div className="contact-help-copy">
                <h3>Need Assistance?</h3>
                <p>{content.helpInstructions}</p>
              </div>
            )}
          </div>

          <div className="contact-panel">
            <div className="panel-header">
              <span className="panel-icon">🗺</span>
              <div>
                <h2>Find Us</h2>
                <p>
                  {content?.latitude !== null && content?.longitude !== null && content?.latitude !== undefined && content?.longitude !== undefined
                    ? `${content.latitude}, ${content.longitude}`
                    : 'Location coordinates not available yet'}
                </p>
              </div>
            </div>
            {mapSrc ? (
              <div className="map-frame-wrap">
                <iframe
                  title="Temple location map"
                  src={mapSrc}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="map-fallback">
                <p>Map coordinates are not available yet.</p>
              </div>
            )}

            {mapSrc && (
              <a
                className="map-open-link"
                href={`https://www.google.com/maps?q=${content.latitude},${content.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        </section>

        <section className="contact-bottom-grid">
          <div className="contact-panel">
            <div className="panel-header">
              <span className="panel-icon">✍</span>
              <div>
                <h2>Send a Message</h2>
                <p>Basic inquiry form for devotees and visitors.</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Your name"
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Your phone number"
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="How can we help you?"
                />
              </label>
              <button type="submit" className="contact-submit-btn">Send Inquiry</button>
              {formStatus && <p className="form-status">{formStatus}</p>}
            </form>
          </div>

          <div className="contact-panel">
            <div className="panel-header">
              <span className="panel-icon">☀</span>
              <div>
                <h2>Follow the Temple</h2>
                <p>Stay connected for events, announcements, and updates.</p>
              </div>
            </div>

            {socialEntries.length > 0 ? (
              <div className="social-grid">
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card"
                    aria-label={SOCIAL_META[platform]?.label || platform}
                  >
                    <span className="social-icon">{SOCIAL_META[platform]?.icon || '•'}</span>
                    <span>{SOCIAL_META[platform]?.label || platform}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="panel-empty">Social links can be added from the admin contact settings.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
