import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ThemeContext = createContext();

// Convert hex color like "#667eea" to an rgba() string so we can tint glass by theme color
const hexToRgba = (hex, alpha = 0.25) => {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  if (h.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#4CAF50',
    textColor: '#333333',
    backgroundColor: '#f5f5f5',
    backgroundImage: '',
    headerGradientStart: '#667eea',
    headerGradientEnd: '#764ba2',
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    navbarBackground: '#1a1a1a',
    buttonPrimary: '#4CAF50',
    buttonSecondary: '#2196F3',
    cardStyle: 'normal',
    cardShape: 'round-rectangle',
    fontFamily: 'Georgia, "Times New Roman", serif'
  });

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    applyTheme();
  }, [theme]);

  const fetchTheme = async () => {
    try {
      const response = await api.get('/theme');
      setTheme(response.data);
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    const headerGradientStart = theme.headerGradientStart || '#667eea';
    const headerGradientEnd = theme.headerGradientEnd || '#764ba2';
    const headerBackground =
      theme.headerBackground ||
      `linear-gradient(135deg, ${headerGradientStart} 0%, ${headerGradientEnd} 100%)`;

    root.style.setProperty('--header-background', headerBackground);
    const bgImage = (theme.backgroundImage || '').trim();
    root.style.setProperty(
      '--background-image',
      bgImage ? `url(${bgImage})` : 'none'
    );
    const glassTint = hexToRgba(theme.primaryColor || '#667eea', 0.28);
    root.style.setProperty('--glass-tint-color', glassTint);
    root.style.setProperty('--navbar-background', theme.navbarBackground);
    root.style.setProperty('--button-primary', theme.buttonPrimary);
    root.style.setProperty('--button-secondary', theme.buttonSecondary);
    root.style.setProperty('--font-family', theme.fontFamily || 'Georgia, "Times New Roman", serif');
    if (document.body) {
      document.body.dataset.cardStyle = theme.cardStyle || 'normal';
      document.body.dataset.cardShape = theme.cardShape || 'round-rectangle';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

