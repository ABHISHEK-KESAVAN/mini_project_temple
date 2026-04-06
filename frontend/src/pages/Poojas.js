import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Poojas.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getImageSrc = (url) => (url && url.startsWith('/uploads')) ? `${API_BASE.replace(/\/api\/?$/, '')}${url}` : url;

const Poojas = () => {
  const [poojas, setPoojas] = useState([]);
  const [selectedPoojas, setSelectedPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoojas();
    // Load selected poojas from localStorage
    const saved = localStorage.getItem('selectedPoojas');
    if (saved) {
      setSelectedPoojas(JSON.parse(saved));
    }
  }, []);

  const fetchPoojas = async () => {
    try {
      const response = await api.get('/poojas');
      setPoojas(response.data);
    } catch (error) {
      console.error('Error fetching poojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePoojaSelection = (pooja) => {
    setSelectedPoojas(prev => {
      const isSelected = prev.find(p => p.poojaId === pooja._id);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(p => p.poojaId !== pooja._id);
      } else {
        newSelection = [...prev, { poojaId: pooja._id, poojaName: pooja.name, price: pooja.price }];
      }
      
      localStorage.setItem('selectedPoojas', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const handleGenerateToken = () => {
    if (selectedPoojas.length === 0) {
      alert('Please select at least one pooja');
      return;
    }
    navigate('/token');
  };

  if (loading) {
    return <Loader label="Loading poojas…" />;
  }

  return (
    <div className="poojas-page page-fade-in">
      <div className="container">
        <h1 className="page-title">Available Poojas</h1>
        
        {selectedPoojas.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Poojas ({selectedPoojas.length})</h3>
            <div className="selected-list">
              {selectedPoojas.map((pooja, index) => (
                <div key={index} className="selected-item">
                  <span>{pooja.poojaName}</span>
                  <span>₹{pooja.price}</span>
                </div>
              ))}
            </div>
            <div className="total-amount">
              <strong>Total: ₹{selectedPoojas.reduce((sum, p) => sum + p.price, 0)}</strong>
            </div>
            <button onClick={handleGenerateToken} className="btn btn-primary">
              Generate Token
            </button>
          </div>
        )}

        <div className="poojas-grid">
          {poojas.length === 0 ? (
            <p>No poojas available at the moment.</p>
          ) : (
            poojas.map(pooja => {
              const isSelected = selectedPoojas.find(p => p.poojaId === pooja._id);
              return (
                <div key={pooja._id} className={`pooja-card ${isSelected ? 'selected' : ''}`}>
                  {pooja.image && (
                    <img 
                      src={getImageSrc(pooja.image)} 
                      alt={pooja.name} 
                      className="pooja-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="pooja-content">
                    <h3>{pooja.name}</h3>
                    {pooja.description && <p className="pooja-description">{pooja.description}</p>}
                    <div className="pooja-details">
                      <div className="detail-item">
                        <span className="label">Timing:</span>
                        <span>{pooja.timing}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Price:</span>
                        <span className="price">₹{pooja.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePoojaSelection(pooja)}
                      className={`btn ${isSelected ? 'btn-danger' : 'btn-primary'}`}
                    >
                      {isSelected ? 'Remove from Token' : 'Add to Token'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Poojas;

