import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Home.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getImageSrc = (url) => (url && url.startsWith('/uploads')) ? `${API_BASE.replace(/\/api\/?$/, '')}${url}` : url;

const SLIDER_INTERVAL_MS = 5000;

const Home = () => {
  const [content, setContent] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  const fetchHomeContent = useCallback(async () => {
    try {
      const [homeRes, poojasRes] = await Promise.all([
        api.get('/home'),
        api.get('/poojas')
      ]);
      setContent(homeRes.data);
      setPoojas(poojasRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent]);

  // Auto-slide
  const banners = content?.banners || [];
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % banners.length);
    }, SLIDER_INTERVAL_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  // Parallax for header + slider, desktop only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const clamped = Math.min(Math.max(y, 0), 400);
      const offset = clamped * 0.4; // max ~160px
      document.documentElement.style.setProperty('--header-parallax-offset', `${offset}px`);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  const aspectRatio = content?.bannerAspectRatio || '16/9';
  const displayPoojas = poojas.slice(0, 6);
  const welcomeText =
    content?.welcomeMessage ||
    'Welcome to our temple. May the divine light bring peace, prosperity, and blessings to you and your family.';

  return (
    <div className="home-page">
      {/* Temple Header - API controlled */}
      <header className="temple-header">
        <div className="temple-header-content container">
          {content?.templeLogo && (
            <img
              src={getImageSrc(content.templeLogo)}
              alt="Temple Logo"
              className="temple-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <h1 className="temple-name">{content?.templeName || 'Temple Name'}</h1>
        </div>
      </header>

      {/* Image Slider - click goes to Gallery */}
      <section className="banner-slider" style={{ ['--banner-aspect']: aspectRatio }}>
        {banners.length > 0 ? (
          <>
            <div className="slider-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
              {banners.map((banner, index) => (
                <Link
                  key={index}
                  to="/gallery"
                  className="slide"
                  aria-label={banner.title ? `View gallery: ${banner.title}` : 'View gallery'}
                >
                  {banner.image ? (
                    <img
                      src={getImageSrc(banner.image)}
                      alt={banner.title || 'Temple'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling?.classList.add('show');
                      }}
                    />
                  ) : null}
                  <div className="slide-placeholder">
                    <span>{banner.title || 'Temple Image'}</span>
                  </div>
                  {(banner.title || banner.description) && (
                    <div className="slide-content">
                      {banner.title && <h2>{banner.title}</h2>}
                      {banner.description && <p>{banner.description}</p>}
                      <span className="slide-cta">View Gallery →</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
            {banners.length > 1 && (
              <div className="slider-dots">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`dot ${i === slideIndex ? 'active' : ''}`}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlideIndex(i)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <Link to="/gallery" className="slide placeholder-banner">
            <span>Temple Images – Click to open Gallery</span>
          </Link>
        )}
      </section>

      <div className="container home-main">
        {/* Welcome */}
        <section className="welcome-section">
          <p className="welcome-text">{welcomeText}</p>
        </section>

        {/* Poojas + About side by side */}
        <section className="home-blocks">
          {/* Pooja options - link to Poojas page */}
          <div className="home-block home-poojas">
            <h2 className="block-title">Poojas</h2>
            {displayPoojas.length > 0 ? (
              <>
                <div className="pooja-cards">
                  {displayPoojas.map((pooja) => (
                    <Link to="/poojas" key={pooja._id} className="pooja-card">
                      {pooja.image && (
                        <div className="pooja-card-img" style={{ ['--card-aspect']: aspectRatio }}>
                          <img src={getImageSrc(pooja.image)} alt={pooja.name} onError={(e) => e.target.style.display = 'none'} />
                        </div>
                      )}
                      <div className="pooja-card-body">
                        <h3>{pooja.name}</h3>
                        <p className="pooja-timing">{pooja.timing}</p>
                        <p className="pooja-price">₹{pooja.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/poojas" className="see-more">
                  See more Poojas →
                </Link>
              </>
            ) : (
              <>
                <p className="block-empty">No poojas added yet.</p>
                <Link to="/poojas" className="see-more">
                  View Poojas →
                </Link>
              </>
            )}
          </div>

          {/* About teaser - See more goes to About */}
          <div className="home-block home-about">
            <h2 className="block-title">About</h2>
            <p className="about-teaser">
              {content?.aboutTeaser || content?.welcomeMessage || 'Welcome to our temple. We invite you to visit and experience the peace and devotion.'}
            </p>
            <Link to="/about" className="see-more">
              See more About →
            </Link>
          </div>
        </section>

        {/* Announcements */}
        {content?.announcements?.filter((a) => a.isActive).length > 0 && (
          <section className="announcements-section">
            <h2 className="block-title">Announcements</h2>
            <div className="announcement-list">
              {content.announcements
                .filter((a) => a.isActive)
                .map((announcement, index) => (
                  <div key={index} className="announcement-card">
                    <h3>{announcement.title}</h3>
                    <p>{announcement.message}</p>
                    {announcement.date && (
                      <small>{new Date(announcement.date).toLocaleDateString()}</small>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section className="quick-actions">
          <Link to="/poojas" className="quick-btn">📿 Poojas</Link>
          <Link to="/token" className="quick-btn">🎫 Generate Token</Link>
          <Link to="/map" className="quick-btn">📍 Location</Link>
          <Link to="/contact" className="quick-btn">📞 Contact</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
