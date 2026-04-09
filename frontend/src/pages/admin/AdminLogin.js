import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { clearSession, setSession } from '../../utils/session';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearSession();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const err = {};
    if ((formData.username || '').trim().length < 3) err.username = 'Username must be at least 3 characters';
    if ((formData.password || '').length < 6) err.password = 'Password must be at least 6 characters';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const payload = {
        username: formData.username.trim(),
        password: formData.password
      };
      const response = await api.post('/auth/login', payload);
      setSession(response.data);
      navigate('/admin');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach((entry) => {
          errMap[entry.field] = entry.message;
        });
        setFieldErrors(errMap);
      }
      setError(data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoFocus
                autoComplete="username"
                placeholder="Min 3 characters"
              />
              {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Min 6 characters"
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="login-help">
            <strong>Login not working?</strong>
            <p>Make sure the backend is running, the app is pointing to the correct MongoDB database, and your admin password matches the active database.</p>
          </div>
          <p className="back-link">
            <a href="/">Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
