import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './About.css';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await api.get('/about');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About Our Temple</h1>

        {/* History */}
        {content?.history && (
          <section className="about-section">
            <h2>History</h2>
            <p>{content.history}</p>
          </section>
        )}

        {/* Deity Importance */}
        {content?.deityImportance && (
          <section className="about-section">
            <h2>Importance of the Deity</h2>
            <p>{content.deityImportance}</p>
          </section>
        )}

        {/* Daily Timings */}
        {content?.dailyTimings && (
          <section className="about-section">
            <h2>Daily Darshan Timings</h2>
            <div className="timings-grid">
              {content.dailyTimings.morning && (
                <div className="timing-card">
                  <h3>Morning</h3>
                  <p>{content.dailyTimings.morning}</p>
                </div>
              )}
              {content.dailyTimings.afternoon && (
                <div className="timing-card">
                  <h3>Afternoon</h3>
                  <p>{content.dailyTimings.afternoon}</p>
                </div>
              )}
              {content.dailyTimings.evening && (
                <div className="timing-card">
                  <h3>Evening</h3>
                  <p>{content.dailyTimings.evening}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Rules */}
        {content?.rules && content.rules.length > 0 && (
          <section className="about-section">
            <h2>Temple Rules & Guidelines</h2>
            <ul className="rules-list">
              {content.rules.map((rule, index) => (
                <li key={index}>{rule.rule}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Festivals */}
        {content?.festivals && content.festivals.length > 0 && (
          <section className="about-section">
            <h2>Festivals</h2>
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
          </section>
        )}

        {/* Spiritual Info */}
        {content?.spiritualInfo && (
          <section className="about-section">
            <h2>Spiritual Information</h2>
            <p>{content.spiritualInfo}</p>
          </section>
        )}

        {/* Trust Info */}
        {content?.trustInfo && (
          <section className="about-section">
            <h2>Trust Information</h2>
            <p>{content.trustInfo}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default About;

