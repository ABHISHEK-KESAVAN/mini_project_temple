import React, { useState } from 'react';
import api, { getUploadUrl } from '../utils/api';
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
      // Do NOT set Content-Type manually — the api.js request interceptor
      // detects FormData and removes Content-Type so axios generates the
      // correct multipart boundary automatically.
      const response = await api.post('/upload/image', formData);

      // Store the relative path (e.g. /uploads/image-xxx.jpg) so it works on any host
      const imageUrl = response.data.url;
      const previewUrl = getUploadUrl(imageUrl);
      setPreview(previewUrl);
      onChange(imageUrl);
      setUseUrl(false);
    } catch (error) {
      const serverMsg = error.response?.data?.message || error.message;
      console.error('Upload error:', serverMsg, error);
      alert(`Failed to upload image: ${serverMsg}\n\nPlease try again or use a URL instead.`);
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

