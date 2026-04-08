import React, { useState, useEffect, useRef, useCallback } from 'react';
import api, { getUploadUrl } from '../utils/api';
import Loader from '../components/Loader';
import './About.css';

const AnimatedSection = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('in-view');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <section ref={ref} className={`about-section ${className}`}>
      {children}
    </section>
  );
};

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAboutContent = useCallback(async () => {
    try {
      const response = await api.get('/about');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  if (loading) {
    return <div className="about-page"><Loader label="Loading temple story..." /></div>;
  }

  const timingIcons = { morning: '🌅', afternoon: '☀️', evening: '🌙' };
  const heroBackgroundImage = getUploadUrl(content?.hero?.backgroundImage || '');
  const historyImage = getUploadUrl(content?.history?.image || '');
  const historyText = content?.history?.text || '';

  return (
    <div className="about-page page-fade-in">
      <div className="about-hero">
        <div
          className="about-hero-bg"
          style={{
            backgroundImage: heroBackgroundImage
              ? `linear-gradient(160deg, rgba(10, 8, 4, 0.8) 0%, rgba(20, 14, 5, 0.7) 50%, rgba(10, 8, 4, 0.85) 100%), url(${heroBackgroundImage})`
              : undefined
          }}
        />
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          {/* <span className="about-hero-icon">🛕</span> */}
          <h1 className="about-hero-title">{content?.heroTitle}</h1>
          <p className="about-hero-subtitle">{content?.heroSubtitle}</p>
          <div className="about-hero-divider" />
        </div>
      </div>

      <div className="gold-divider" />

      <div className="about-container">
        {historyText && (
          <AnimatedSection delay={0}>
            <div className="section-header">
              <span className="section-icon">📜</span>
              <h2>History</h2>
            </div>
            <div className="history-two-col">
              {historyImage ? (
                <div className="history-image-wrap">
                  <img
                    src={historyImage}
                    alt={content?.heroTitle || 'Temple history'}
                    className="history-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement?.classList.add('history-image-wrap-error');
                    }}
                  />
                </div>
              ) : (
                <div className="history-deco-panel" aria-hidden="true">
                  <span className="history-deco-icon">🛕</span>
                </div>
              )}
              <div className="history-text">
                <p>{historyText}</p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {content?.deityImportance && (
          <AnimatedSection delay={80}>
            <div className="section-header">
              <span className="section-icon">🪔</span>
              <h2>Importance of the Deity</h2>
            </div>
            <p>{content.deityImportance}</p>
          </AnimatedSection>
        )}

        {content?.dailyTimings && (
          <AnimatedSection delay={160}>
            <div className="section-header">
              <span className="section-icon">🕰️</span>
              <h2>Daily Darshan Timings</h2>
            </div>
            <div className="timings-grid">
              {['morning', 'afternoon', 'evening'].map((period) =>
                content.dailyTimings[period] ? (
                  <div key={period} className="timing-card">
                    <span className="timing-icon">{timingIcons[period]}</span>
                    <h3>{period.charAt(0).toUpperCase() + period.slice(1)}</h3>
                    <p>{content.dailyTimings[period]}</p>
                  </div>
                ) : null
              )}
            </div>
          </AnimatedSection>
        )}

        {content?.rules && content.rules.length > 0 && (
          <AnimatedSection delay={240}>
            <div className="section-header">
              <span className="section-icon">📋</span>
              <h2>Temple Rules &amp; Guidelines</h2>
            </div>
            <ul className="rules-list">
              {content.rules.map((rule, index) => (
                <li key={index}>{rule.rule}</li>
              ))}
            </ul>
          </AnimatedSection>
        )}

        {content?.festivals && content.festivals.length > 0 && (
          <AnimatedSection delay={320}>
            <div className="section-header">
              <span className="section-icon">🎊</span>
              <h2>Festivals</h2>
            </div>
            <div className="festivals-grid">
              {content.festivals.map((festival, index) => (
                <div key={index} className="festival-card">
                  <h3>{festival.name}</h3>
                  {festival.date && (
                    <p className="festival-date">
                      {new Date(festival.date).toLocaleDateString()}
                    </p>
                  )}
                  {festival.description && <p>{festival.description}</p>}
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {content?.spiritualInfo && (
          <AnimatedSection delay={400}>
            <div className="section-header">
              <span className="section-icon">🙏</span>
              <h2>Spiritual Information</h2>
            </div>
            <p>{content.spiritualInfo}</p>
          </AnimatedSection>
        )}

        {content?.trustInfo && (
          <AnimatedSection delay={480}>
            <div className="section-header">
              <span className="section-icon">🏛️</span>
              <h2>Trust Information</h2>
            </div>
            <p>{content.trustInfo}</p>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default About;
