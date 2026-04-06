import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import './TokenView.css';

/* ── helpers ─────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  pending:   { label: 'VALID TOKEN',    icon: '✅', cls: 'banner-pending' },
  used:      { label: 'TOKEN USED',     icon: '☑️', cls: 'banner-used' },
  expired:   { label: 'TOKEN EXPIRED',  icon: '⛔', cls: 'banner-expired' },
  cancelled: { label: 'TOKEN CANCELLED',icon: '🚫', cls: 'banner-cancelled' },
};

/** Returns a human-readable expiry countdown string */
const getExpiryInfo = (expiresAt, status) => {
  if (!expiresAt) return null;
  const msLeft = new Date(expiresAt).getTime() - Date.now();

  if (status !== 'pending') {
    return { text: `Expired on ${new Date(expiresAt).toLocaleString()}`, cls: 'expiry-done' };
  }
  if (msLeft <= 0) {
    return { text: 'This token has expired', cls: 'expiry-done' };
  }

  const totalMin = Math.floor(msLeft / 60000);
  const hrs  = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} minute${mins !== 1 ? 's' : ''}`;
  const cls = totalMin <= 15 ? 'expiry-soon' : 'expiry-ok';
  return { text: `⏱ Expires in ${timeStr}  (${new Date(expiresAt).toLocaleString()})`, cls };
};

/* ── Component ───────────────────────────────────────────────────────────── */

const TokenView = () => {
  const { id } = useParams();
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tokens/${id}`);
      setToken(res.data);
      setError('');
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError('Token not found. The QR code may be invalid or the token was deleted.');
      } else {
        setError('Unable to load token details. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  /* auto-refresh every 30 s so expiry stays current */
  useEffect(() => {
    const interval = setInterval(fetchToken, 30000);
    return () => clearInterval(interval);
  }, [fetchToken]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="token-view-page">
        <Loader label="Verifying token…" />
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="token-view-page">
        <div className="token-view-error">
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h2>Token Not Found</h2>
          <p>{error}</p>
          <Link to="/poojas" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Book a Pooja
          </Link>
        </div>
      </div>
    );
  }

  /* ── Render token ── */
  const statusKey  = token.status || 'pending';
  const bannerCfg  = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const expiryInfo = getExpiryInfo(token.expiresAt, statusKey);

  return (
    <div className="token-view-page page-fade-in">
      <div className="container" style={{ maxWidth: 600, padding: '0 1rem' }}>

        <div className="token-view-card">

          {/* ── Status banner ── */}
          <div className={`token-view-banner ${bannerCfg.cls}`}>
            <span className="banner-icon">{bannerCfg.icon}</span>
            <span>{bannerCfg.label}</span>
          </div>

          {/* ── Token number ── */}
          <div className="token-view-header">
            <h2>Token Number</h2>
            <div className="token-view-number">{token.tokenNumber}</div>
          </div>

          {/* ── Details ── */}
          <div className="token-view-details">
            <div className="tv-row">
              <span className="tv-label">Devotee</span>
              <span className="tv-value">{token.devoteeName}</span>
            </div>
            <div className="tv-row">
              <span className="tv-label">Mobile</span>
              <span className="tv-value">
                {/* Mask middle digits for privacy */}
                {token.mobileNumber
                  ? token.mobileNumber.replace(/(\d{2})\d{6}(\d{2})/, '$1••••••$2')
                  : '—'}
              </span>
            </div>
            <div className="tv-row">
              <span className="tv-label">Total Amount</span>
              <span className="tv-value amount">₹{token.totalAmount}</span>
            </div>
            <div className="tv-row">
              <span className="tv-label">Status</span>
              <span className={`tv-value status-${statusKey}`}>
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </span>
            </div>
            {token.usedAt && (
              <div className="tv-row">
                <span className="tv-label">Used At</span>
                <span className="tv-value">{new Date(token.usedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* ── Expiry countdown ── */}
          {expiryInfo && (
            <div className={`token-view-expiry ${expiryInfo.cls}`}>
              {expiryInfo.text}
            </div>
          )}

          {/* ── Poojas list ── */}
          {token.poojas && token.poojas.length > 0 && (
            <div className="token-view-poojas">
              <h3>Selected Poojas</h3>
              {token.poojas.map((p, i) => (
                <div key={i} className="tv-pooja-item">
                  <span>{p.poojaName}</span>
                  <span className="tv-pooja-price">₹{p.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Footer note ── */}
          <div className="token-view-footer">
            Show this page at the temple counter • Payment is collected offline
          </div>

        </div>

      </div>
    </div>
  );
};

export default TokenView;
