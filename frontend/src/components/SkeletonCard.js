import React from 'react';
import './Loader.css';

/**
 * <SkeletonCard />
 *
 * Props:
 *  - showImage: boolean — show image placeholder (default: false)
 *  - lines: number — how many text skeleton lines to show (default: 3)
 *  - style: object — optional inline styles for the card wrapper
 */
const SkeletonCard = ({ showImage = false, lines = 3, style }) => {
  const lineWidths = ['wide', 'full', 'medium', 'short', 'full'];

  return (
    <div className="skeleton-card" style={style} aria-hidden="true">
      {showImage && <div className="skeleton-image" />}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-line ${lineWidths[i % lineWidths.length]}`}
        />
      ))}
    </div>
  );
};

/**
 * <SkeletonGrid />
 *
 * Renders a responsive grid of SkeletonCards.
 *
 * Props:
 *  - count: number — how many cards to show (default: 3)
 *  - showImage: boolean — passed down to each SkeletonCard (default: false)
 *  - lines: number — passed down to each SkeletonCard (default: 3)
 */
export const SkeletonGrid = ({ count = 3, showImage = false, lines = 3 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} showImage={showImage} lines={lines} />
    ))}
  </div>
);

export default SkeletonCard;
