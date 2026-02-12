import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/tokens/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3>Total Tokens</h3>
              <p className="stat-number">{stats?.totalTokens || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Tokens</h3>
              <p className="stat-number">{stats?.pendingTokens || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Used Tokens</h3>
              <p className="stat-number">{stats?.usedTokens || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Today's Tokens</h3>
              <p className="stat-number">{stats?.todayTokens || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">₹{stats?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>

        <div className="admin-menu">
          <h2>Management Options</h2>
          <div className="menu-grid">
            <Link to="/admin/home" className="menu-card">
              <div className="menu-icon">🏠</div>
              <h3>Manage Home Page</h3>
              <p>Edit temple name, banners, announcements</p>
            </Link>
            <Link to="/admin/about" className="menu-card">
              <div className="menu-icon">📖</div>
              <h3>Manage About Page</h3>
              <p>Edit history, timings, rules</p>
            </Link>
            <Link to="/admin/poojas" className="menu-card">
              <div className="menu-icon">📿</div>
              <h3>Manage Poojas</h3>
              <p>Add, edit, or remove poojas</p>
            </Link>
            <Link to="/admin/tokens" className="menu-card">
              <div className="menu-icon">🎫</div>
              <h3>Manage Tokens</h3>
              <p>View and verify tokens</p>
            </Link>
            <Link to="/admin/token-settings" className="menu-card">
              <div className="menu-icon">⚙️</div>
              <h3>Token Limit & Expiry</h3>
              <p>Set daily/hourly limit and token validity</p>
            </Link>
            <Link to="/admin/map" className="menu-card">
              <div className="menu-icon">📍</div>
              <h3>Manage Map</h3>
              <p>Update temple location</p>
            </Link>
            <Link to="/admin/contact" className="menu-card">
              <div className="menu-icon">📞</div>
              <h3>Manage Contact</h3>
              <p>Update contact information</p>
            </Link>
            <Link to="/admin/theme" className="menu-card">
              <div className="menu-icon">🎨</div>
              <h3>Manage Theme & Colors</h3>
              <p>Customize website colors</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

