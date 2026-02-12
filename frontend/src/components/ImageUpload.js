import React, { useState } from 'react';
import api from '../utils/api';
import './ImageUpload.css';

const ImageUpload = ({ value, onChange, label = 'Image', accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [useUrl, setUseUrl] = useState(!!value && !value.startsWith('/uploads'));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Use the full URL for the uploaded image
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const imageUrl = `${baseUrl}${response.data.url}`;
      setPreview(imageUrl);
      onChange(imageUrl);
      setUseUrl(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again or use a URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="image-upload-container">
      <label>{label}</label>
      <div className="image-upload-options">
        <div className="upload-tabs">
          <button
            type="button"
            className={`tab ${!useUrl ? 'active' : ''}`}
            onClick={() => setUseUrl(false)}
          >
            Upload File
          </button>
          <button
            type="button"
            className={`tab ${useUrl ? 'active' : ''}`}
            onClick={() => setUseUrl(true)}
          >
            Use URL
          </button>
        </div>

        {!useUrl ? (
          <div className="upload-section">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            {uploading && <p className="upload-status">Uploading...</p>}
          </div>
        ) : (
          <div className="url-section">
            <input
              type="text"
              value={value || ''}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="url-input"
            />
          </div>
        )}

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            <p className="preview-note">Preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

