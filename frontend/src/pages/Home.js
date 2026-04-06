import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Home.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getImageSrc = (url) => (url && url.startsWith('/uploads')) ? `${API_BASE.replace(/\/api\/?$/, '')}${url}` : url;

/** When no hero images are configured, use a neutral temple-themed placeholder */
const DEFAULT_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80';

const SLIDE_INTERVAL_MS = 3000;

const Home = () => {
  const [content, setContent] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(1);
  const pendingAdvance = useRef(false);

  const heroUrls = useMemo(() => {
    if (!content) return [];
    let list = [];
    if (Array.isArray(content.heroImages) && content.heroImages.length) {
      list = content.heroImages.filter((u) => u && String(u).trim());
    }
    if (list.length === 0 && content.heroImage) {
      list = [content.heroImage];
    }
    if (list.length === 0 && content.banners?.[0]?.image) {
      list = [content.banners[0].image];
    }
    if (list.length === 0) {
      list = [DEFAULT_HERO_FALLBACK];
    }
    return list;
  }, [content]);

  const heroUrlsKey = heroUrls.join('|');

  useEffect(() => {
    setSlideIndex(0);
    setBgOpacity(1);
    pendingAdvance.current = false;
  }, [heroUrlsKey]);

  useEffect(() => {
    if (heroUrls.length <= 1) return undefined;
    const id = setInterval(() => {
      pendingAdvance.current = true;
      setBgOpacity(0);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [heroUrlsKey]);

  const handleHeroBgTransitionEnd = (e) => {
    if (e.propertyName !== 'opacity') return;
    if (!pendingAdvance.current) return;
    pendingAdvance.current = false;
    setSlideIndex((i) => (i + 1) % heroUrls.length);
    requestAnimationFrame(() => setBgOpacity(1));
  };

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

  if (loading) {
    return <Loader label="Preparing the sacred space…" />;
  }

  const heroBgUrl = heroUrls[slideIndex] ? getImageSrc(heroUrls[slideIndex]) : '';
  const heroTitle = content?.heroWelcomeTitle || content?.templeName || 'Welcome';
  const welcomeMessage = content?.welcomeMessage || 'May the divine light bring peace, prosperity, and blessings to you and your family.';
  const heroCtaText = content?.heroCtaText || 'View Poojas';
  const heroCtaLink = content?.heroCtaLink || '/poojas';
  const galleryImages = content?.banners || [];
  const aspectRatio = content?.bannerAspectRatio || '16/9';
  const top3Poojas = poojas.filter(p => p.isActive !== false).slice(0, 3);
  const activeAnnouncements = content?.announcements?.filter((a) => a.isActive) || [];

  return (
    <div className="home-page page-fade-in">
      {/* Hero Welcome Section — background cycles; overlay + content unchanged */}
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{
            backgroundImage: heroBgUrl ? `url(${heroBgUrl})` : undefined,
            opacity: bgOpacity
          }}
          onTransitionEnd={handleHeroBgTransitionEnd}
        />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-message">{welcomeMessage}</p>
          <Link to={heroCtaLink} className="hero-cta btn btn-primary">
            {heroCtaText}
          </Link>
        </div>
      </section>

      <div className="container home-main">
        {/* About Us Section */}
        <section className="about-section">
          <h2 className="section-title">About Us</h2>
          <div className="about-grid">
            <div className="about-image-wrap">
              {content?.aboutImage ? (
                <img
                  src={getImageSrc(content.aboutImage)}
                  alt="Temple"
                  className="about-image"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <div className="about-image-placeholder">Temple Image</div>
              )}
            </div>
            <div className="about-text">
              <p className="about-content">
                {content?.aboutTeaser || content?.welcomeMessage || 'Welcome to our temple. We invite you to visit and experience peace and devotion.'}
              </p>
              <Link to="/about" className="see-more">See more About →</Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section className="gallery-section">
            <h2 className="section-title">Gallery</h2>
            <div
              className="home-gallery-grid"
              style={{ ['--gallery-aspect']: aspectRatio }}
            >
              {galleryImages.map((banner, index) => (
                <div key={index} className="home-gallery-item">
                  <div className="home-gallery-inner">
                    {banner.image ? (
                      <img
                        src={getImageSrc(banner.image)}
                        alt={banner.title || `Gallery ${index + 1}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling?.classList.add('show');
                        }}
                      />
                    ) : null}
                    <div className="home-gallery-placeholder">
                      <span>{banner.title || `Image ${index + 1}`}</span>
                    </div>
                  </div>
                  {(banner.title || banner.description) && (
                    <div className="home-gallery-caption">
                      {banner.title && <strong>{banner.title}</strong>}
                      {banner.description && <span>{banner.description}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/gallery" className="see-more see-more-center">View full Gallery →</Link>
          </section>
        )}

        {/* Top 3 Poojas Preview */}
        <section className="poojas-preview-section">
          <h2 className="section-title">Poojas</h2>
          {top3Poojas.length > 0 ? (
            <>
              <div className="poojas-preview-grid">
                {top3Poojas.map((pooja) => (
                  <Link to="/poojas" key={pooja._id} className="pooja-preview-card">
                    {pooja.image && (
                      <div className="pooja-preview-img" style={{ ['--card-aspect']: aspectRatio }}>
                        <img src={getImageSrc(pooja.image)} alt={pooja.name} onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                    <div className="pooja-preview-body">
                      <h3>{pooja.name}</h3>
                      <p className="pooja-preview-timing">{pooja.timing}</p>
                      <p className="pooja-preview-price">₹{pooja.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="poojas-preview-actions">
                <Link to="/poojas" className="btn btn-primary">View All Poojas</Link>
              </div>
            </>
          ) : (
            <div className="poojas-preview-empty">
              <p className="block-empty">No poojas added yet.</p>
              <Link to="/poojas" className="btn btn-primary">View Poojas</Link>
            </div>
          )}
        </section>

        {/* Announcements Section */}
        {activeAnnouncements.length > 0 && (
          <section className="announcements-section">
            <h2 className="section-title">Announcements</h2>
            <div className="announcement-list">
              {activeAnnouncements.map((announcement, index) => (
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
      </div>
    </div>
  );
};

export default Home;
