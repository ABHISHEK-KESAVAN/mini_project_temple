import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import api from '../../utils/api';
import { setSession } from '../../utils/session';
import './AdminPages.css';

const initialFormState = {
  username: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfile(response.data);
      setFormData((prev) => ({
        ...prev,
        username: response.data.username || ''
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load your profile right now.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
      form: ''
    }));
    setMessage('');
  };

  const validate = () => {
    const errors = {};
    const username = formData.username.trim();
    const usernameChanged = username !== (profile?.username || '');
    const passwordChanged = Boolean(formData.newPassword || formData.confirmPassword);

    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!usernameChanged && !passwordChanged) {
      errors.form = 'Update your username or enter a new password before saving.';
    }

    if ((usernameChanged || passwordChanged) && !formData.currentPassword) {
      errors.currentPassword = 'Current password is required to confirm changes';
    }

    if (passwordChanged && formData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }

    if (passwordChanged && formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'New password and confirmation must match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setMessage('');
    setFieldErrors({});

    try {
      const payload = {
        username: formData.username.trim(),
        currentPassword: formData.currentPassword
      };

      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
      }

      const response = await api.put('/auth/me', payload);
      setSession(response.data);
      setProfile(response.data.user);
      setFormData({
        ...initialFormState,
        username: response.data.user.username
      });
      setMessage(response.data.message || 'Profile updated successfully.');
      setMessageType('success');
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const nextErrors = {};
        data.errors.forEach((entry) => {
          nextErrors[entry.field] = entry.message;
        });
        setFieldErrors(nextErrors);
      }
      setMessage(data?.message || 'Unable to save profile changes.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading profile..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">Back to Dashboard</Link>
          <h1>Admin Profile</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          <section className="admin-form-card">
            <h2>Account details</h2>
            <div className="profile-meta">
              <div className="profile-meta-item">
                <span>Role</span>
                <strong>{profile?.role || 'admin'}</strong>
              </div>
              <div className="profile-meta-item">
                <span>Last updated</span>
                <strong>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'Just now'}</strong>
              </div>
            </div>
            <p className="form-hint">
              Username and password changes are protected with your current password, and a fresh JWT session is issued after saving.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h2>Login credentials</h2>
              {fieldErrors.form && <div className="message error">{fieldErrors.form}</div>}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="Enter admin username"
                />
                {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Required to confirm changes"
                />
                {fieldErrors.currentPassword && <span className="field-error">{fieldErrors.currentPassword}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                />
                {fieldErrors.newPassword && <span className="field-error">{fieldErrors.newPassword}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Re-enter the new password"
                />
                {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
