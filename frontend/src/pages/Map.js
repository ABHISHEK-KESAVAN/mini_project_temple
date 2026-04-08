import React, { useState, useEffect } from 'react';
import api, { getUploadUrl } from '../utils/api';
import Loader from '../components/Loader';
import './Map.css';

const Map = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapContent();
  }, []);

  const fetchMapContent = async () => {
    try {
      const response = await api.get('/map');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching map content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader label="Loading location…" />;
  }
  return (
    <div className="map-page page-fade-in">
      <div className="container">
        <h1 className="page-title">Temple Location</h1>

        {content?.templeAddress && (
          <div className="address-section">
            <h2>Address</h2>
            <p>{content.templeAddress}</p>
          </div>
        )}

        {content?.latitude && content?.longitude ? (
          <div className="map-container">
            {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
              <iframe
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${content.latitude},${content.longitude}`}
              ></iframe>
            ) : (
              <div className="map-placeholder">
                <p>📍 Coordinates: {content.latitude}, {content.longitude}</p>
                <p>To enable Google Maps, add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file</p>
                <p><a href={`https://www.google.com/maps?q=${content.latitude},${content.longitude}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
              </div>
            )}
          </div>
        ) : (
          <div className="map-placeholder">
            <p>Map location will be displayed here. Admin needs to set the coordinates.</p>
          </div>
        )}

        {content?.directions && (
          <div className="directions-section">
            <h2>Directions</h2>
            <p>{content.directions}</p>
          </div>
        )}

        {content?.insideTempleMap?.image && (
          <div className="inside-map-section">
            <h2>Inside Temple Navigation</h2>
            <img 
              src={getUploadUrl(content.insideTempleMap.image)}
              alt="Inside Temple Map" 
              className="inside-map-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<p style="color: #666; padding: 2rem;">Image failed to load. Please check the image URL.</p>';
              }}
            />
            {content.insideTempleMap.description && (
              <p>{content.insideTempleMap.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;

