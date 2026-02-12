import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../utils/api';
import './Token.css';

const Token = () => {
  const [selectedPoojas, setSelectedPoojas] = useState([]);
  const [formData, setFormData] = useState({
    devoteeName: '',
    mobileNumber: ''
  });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenRules, setTokenRules] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('selectedPoojas');
    if (!saved || JSON.parse(saved).length === 0) {
      navigate('/poojas');
      return;
    }
    setSelectedPoojas(JSON.parse(saved));
  }, [navigate]);

  useEffect(() => {
    api.get('/settings/token').then(res => setTokenRules(res.data)).catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const err = {};
    const name = (formData.devoteeName || '').trim();
    if (name.length < 2) err.devoteeName = 'Name must be at least 2 characters';
    const mobile = (formData.mobileNumber || '').trim();
    if (!/^[0-9]{10}$/.test(mobile)) err.mobileNumber = 'Enter a valid 10-digit mobile number';
    setFieldErrors(err);
    setSubmitError('');
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPoojas.length === 0) {
      setSubmitError('Please select at least one pooja');
      navigate('/poojas');
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');
    try {
      const response = await api.post('/tokens', {
        devoteeName: formData.devoteeName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        poojas: selectedPoojas.map(p => ({ poojaId: p.poojaId }))
      });
      setToken(response.data);
      localStorage.removeItem('selectedPoojas');
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status === 429) {
        setSubmitError(data?.message || 'Token limit reached. Please try again later.');
      } else if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setFieldErrors(errMap);
        setSubmitError(data?.message || 'Please fix the errors below.');
      } else {
        setSubmitError(data?.message || 'Error generating token. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (token) {
    const isExpired = token.status === 'expired' || (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now());
    return (
      <div className="token-page">
        <div className="container">
          <div className="token-success">
            <h1>Token Generated Successfully!</h1>
            <div className="token-card">
              <div className="token-header">
                <h2>Token Number</h2>
                <div className="token-number">{token.tokenNumber}</div>
              </div>
              
              <div className="token-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span>{token.devoteeName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Mobile:</span>
                  <span>{token.mobileNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Amount:</span>
                  <span className="amount">₹{token.totalAmount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span style={{ fontWeight: 'bold', color: isExpired ? '#f44336' : '#4CAF50' }}>
                    {isExpired ? 'expired' : (token.status || 'pending')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Expires At:</span>
                  <span>{token.expiresAt ? new Date(token.expiresAt).toLocaleString() : '-'}</span>
                </div>
              </div>

              <div className="poojas-list">
                <h3>Selected Poojas:</h3>
                {token.poojas.map((pooja, index) => (
                  <div key={index} className="pooja-item">
                    <span>{pooja.poojaName}</span>
                    <span>₹{pooja.price}</span>
                  </div>
                ))}
              </div>

              <div className="qr-code-section">
                <h3>QR Code</h3>
                <div className="qr-code">
                  <QRCodeSVG value={JSON.stringify({
                    tokenNumber: token.tokenNumber,
                    devoteeName: token.devoteeName,
                    mobileNumber: token.mobileNumber,
                    totalAmount: token.totalAmount,
                    expiresAt: token.expiresAt
                  })} size={200} />
                </div>
              </div>

              <div className="instructions">
                <h3>Important Instructions:</h3>
                <ul>
                  <li>Show this token at the temple counter</li>
                  <li>Payment to be done offline at the temple</li>
                  <li>Keep this token safe until your visit</li>
                  <li>Token is valid for the selected poojas only</li>
                  <li>If you do not show up before the expiry time, this token will expire and you must generate a new token</li>
                </ul>
              </div>

              <div className="token-actions">
                <button onClick={handlePrint} className="btn btn-primary">
                  Print Token
                </button>
                <button onClick={() => navigate('/poojas')} className="btn btn-secondary">
                  Book Another Pooja
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="token-page">
      <div className="container">
        <h1 className="page-title">Generate Token</h1>

        {tokenRules && (
          <div className="token-rules" style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <strong>Token rules:</strong> Valid for {tokenRules.expiryMinutes} minutes. Limit: {tokenRules.limitValue} tokens per {tokenRules.limitType === 'day' ? 'day' : 'hour'}. If you do not show up in time, the token will expire and you will need to generate a new one.
          </div>
        )}

        {submitError && (
          <div className="message error" style={{ marginBottom: '1rem' }}>{submitError}</div>
        )}
        
        <div className="selected-poojas-summary">
          <h3>Selected Poojas</h3>
          {selectedPoojas.map((pooja, index) => (
            <div key={index} className="summary-item">
              <span>{pooja.poojaName}</span>
              <span>₹{pooja.price}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ₹{selectedPoojas.reduce((sum, p) => sum + p.price, 0)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="token-form">
          <div className="form-group">
            <label>Devotee Name *</label>
            <input
              type="text"
              name="devoteeName"
              value={formData.devoteeName}
              onChange={(e) => { handleInputChange(e); setFieldErrors(prev => ({ ...prev, devoteeName: '' })); }}
              placeholder="Enter your name (min 2 characters)"
              maxLength={100}
            />
            {fieldErrors.devoteeName && <span className="field-error">{fieldErrors.devoteeName}</span>}
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) => { handleInputChange(e); setFieldErrors(prev => ({ ...prev, mobileNumber: '' })); }}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {fieldErrors.mobileNumber && <span className="field-error">{fieldErrors.mobileNumber}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating Token...' : 'Generate Token'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Token;

