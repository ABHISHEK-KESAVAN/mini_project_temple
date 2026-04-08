import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getUploadUrl } from '../utils/api';
import Loader from '../components/Loader';
import './Gallery.css';

const Gallery = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loader label="Loading gallery…" />;
  }

  const banners = content?.banners || [];
  const aspectRatio = content?.bannerAspectRatio || '16/9';

  return (
    <div className="gallery-page page-fade-in">
      <div className="container">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle">Images from our temple. Same images as on the home slider.</p>

        {banners.length === 0 ? (
          <div className="gallery-empty">
            <p>No images yet. Admin can add images in Manage Home (banners).</p>
            <Link to="/" className="btn-link">Back to Home</Link>
          </div>
        ) : (
          <div 
            className="gallery-grid" 
            style={{ ['--gallery-aspect']: aspectRatio }}
          >
            {banners.map((banner, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-item-inner">
                  {banner.image ? (
                    <img
                      src={getUploadUrl(banner.image)}
                      alt={banner.title || `Gallery ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling?.classList.add('show');
                      }}
                    />
                  ) : null}
                  <div className="gallery-placeholder">
                    <span>{banner.title || `Image ${index + 1}`}</span>
                  </div>
                </div>
                {(banner.title || banner.description) && (
                  <div className="gallery-caption">
                    {banner.title && <strong>{banner.title}</strong>}
                    {banner.description && <span>{banner.description}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
