import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import api from '../../utils/api';
import { clearSession, getStoredUser } from '../../utils/session';
import './AdminDashboard.css';

const statCards = [
  { key: 'totalTokens', title: 'Total Tokens', icon: 'TK' },
  { key: 'pendingTokens', title: 'Pending Tokens', icon: 'PD' },
  { key: 'usedTokens', title: 'Used Tokens', icon: 'UD' },
  { key: 'todayTokens', title: "Today's Tokens", icon: 'TD' }
];

const managementLinks = [
  { to: '/admin/home', icon: 'HM', title: 'Manage Home Page', description: 'Edit temple name, banners, announcements' },
  { to: '/admin/about', icon: 'AB', title: 'Manage About Page', description: 'Edit history, timings, rules' },
  { to: '/admin/poojas', icon: 'PJ', title: 'Manage Poojas', description: 'Add, edit, or remove poojas' },
  { to: '/admin/tokens', icon: 'TK', title: 'Manage Tokens', description: 'View and verify tokens' },
  { to: '/admin/token-settings', icon: 'TS', title: 'Token Limit and Expiry', description: 'Set daily or hourly limit and token validity' },
  { to: '/admin/map', icon: 'MP', title: 'Manage Map', description: 'Update temple location' },
  { to: '/admin/contact', icon: 'CT', title: 'Manage Contact', description: 'Update contact information' },
  { to: '/admin/footer', icon: 'FT', title: 'Manage Footer', description: 'Update footer content and links' },
  { to: '/admin/theme', icon: 'TH', title: 'Manage Theme and Colors', description: 'Customize website colors' },
  { to: '/admin/profile', icon: 'PR', title: 'Admin Profile', description: 'Change your username and password securely' }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getStoredUser();

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
    clearSession();
    navigate('/admin/login');
  };

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">Signed in as {currentUser?.username || 'admin'}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.key} className="stat-card">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <h3>{card.title}</h3>
                <p className="stat-number">{stats?.[card.key] || 0}</p>
              </div>
            </div>
          ))}
          <div className="stat-card">
            <div className="stat-icon">RS</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">Rs {stats?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>

        <div className="admin-menu">
          <h2>Management Options</h2>
          <div className="menu-grid">
            {managementLinks.map((item) => (
              <Link key={item.to} to={item.to} className="menu-card">
                <div className="menu-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
