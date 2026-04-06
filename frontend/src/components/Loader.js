import React from 'react';
import './Loader.css';

/**
 * <Loader />
 *
 * Props:
 *  - variant: 'inline' (default) | 'overlay'
 *      'inline'  — fills the page section (min-height: 60vh), not fixed
 *      'overlay' — fixed full-screen overlay (use for route-level transitions)
 *  - label: string — text shown below the spinner (default: 'Loading…')
 *  - showBar: boolean — show the gold shimmer bar below the label (default: true)
 */
const Loader = ({
  variant = 'inline',
  label = 'Loading\u2026',
  showBar = true,
}) => {
  const cls = variant === 'overlay' ? 'loader-overlay' : 'loader-inline';

  return (
    <div className={cls} role="status" aria-live="polite" aria-label={label}>
      <div className="loader-spinner-wrap">
        <div className="loader-ring" />
        <div className="loader-ring-inner" />
        <span className="loader-om" aria-hidden="true">🕉️</span>
      </div>

      {label && (
        <p className="loader-label">{label}</p>
      )}

      {showBar && <div className="loader-bar" aria-hidden="true" />}
    </div>
  );
};

export default Loader;
