import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

const ManageTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [searchToken, setSearchToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTokens();
  }, [filter]);

  const fetchTokens = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.date) params.date = filter.date;
      
      const response = await api.get('/tokens', { params });
      setTokens(response.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (tokenNumber) => {
    try {
      const response = await api.get(`/tokens/verify/${tokenNumber}`);
      alert(`Token found!\nName: ${response.data.devoteeName}\nAmount: ₹${response.data.totalAmount}\nStatus: ${response.data.status}`);
    } catch (error) {
      alert('Token not found!');
    }
  };

  const handleMarkUsed = async (id) => {
    if (!window.confirm('Mark this token as used?')) {
      return;
    }
    try {
      await api.put(`/tokens/${id}/use`);
      setMessage('Token marked as used!');
      fetchTokens();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating token. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateStatus = async (id, status, label) => {
    if (!window.confirm(`Set this token status to "${label}"?`)) {
      return;
    }
    try {
      await api.put(`/tokens/${id}/status`, { status });
      setMessage(`Token marked as ${label}.`);
      fetchTokens();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating token. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Tokens</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="filters-section">
          <div className="filter-group">
            <label>Search Token Number:</label>
            <input
              type="text"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              placeholder="Enter token number"
            />
            <button onClick={() => handleVerify(searchToken)} className="btn btn-secondary">
              Verify
            </button>
          </div>
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="used">Used</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by Date:</label>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Token Number</th>
                <th>Devotee Name</th>
                <th>Mobile</th>
                <th>Poojas</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Expires At</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No tokens found.
                  </td>
                </tr>
              ) : (
                tokens.map(token => (
                  <tr key={token._id}>
                    <td><strong>{token.tokenNumber}</strong></td>
                    <td>{token.devoteeName}</td>
                    <td>{token.mobileNumber}</td>
                    <td>
                      {token.poojas.map((p, i) => (
                        <div key={i} style={{ fontSize: '0.9rem' }}>
                          {p.poojaName || p.poojaId?.name} (₹{p.price || p.poojaId?.price})
                        </div>
                      ))}
                    </td>
                    <td>₹{token.totalAmount}</td>
                    <td>
                      <span className={`status ${token.status}`}>
                        {token.status}
                      </span>
                    </td>
                    <td>{token.expiresAt ? new Date(token.expiresAt).toLocaleString() : '-'}</td>
                    <td>{new Date(token.createdAt).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleVerify(token.tokenNumber)}
                          className="btn btn-secondary btn-sm"
                        >
                          Verify
                        </button>
                        {token.status === 'pending' && (
                          <button
                            onClick={() => handleMarkUsed(token._id)}
                            className="btn btn-primary btn-sm"
                          >
                            Mark Used
                          </button>
                        )}
                        {token.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(token._id, 'pending', 'pending')}
                            className="btn btn-secondary btn-sm"
                          >
                            Pending
                          </button>
                        )}
                        {token.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(token._id, 'cancelled', 'not verified')}
                            className="btn btn-danger btn-sm"
                          >
                            Not Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTokens;

