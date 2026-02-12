import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const ManagePoojas = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPooja, setEditingPooja] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timing: '',
    price: '',
    isActive: true,
    image: ''
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchPoojas();
  }, []);

  const fetchPoojas = async () => {
    try {
      const response = await api.get('/poojas/all');
      setPoojas(response.data);
    } catch (error) {
      console.error('Error fetching poojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    if (fieldErrors[e.target.name]) setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validatePoojaForm = () => {
    const err = {};
    if ((formData.name || '').trim().length < 2) err.name = 'Pooja name must be at least 2 characters';
    if ((formData.timing || '').trim().length < 2) err.timing = 'Timing is required';
    const price = Number(formData.price);
    if (Number.isNaN(price) || price < 0) err.price = 'Price must be 0 or more';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleEdit = (pooja) => {
    setEditingPooja(pooja);
    setFormData({
      name: pooja.name,
      description: pooja.description || '',
      timing: pooja.timing,
      price: pooja.price,
      isActive: pooja.isActive,
      image: pooja.image || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePoojaForm()) return;
    try {
      if (editingPooja) {
        await api.put(`/poojas/${editingPooja._id}`, formData);
        setMessage('Pooja updated successfully!');
      } else {
        await api.post('/poojas', formData);
        setMessage('Pooja added successfully!');
      }
      setShowForm(false);
      setEditingPooja(null);
      setFormData({
        name: '',
        description: '',
        timing: '',
        price: '',
        isActive: true,
        image: ''
      });
      setFieldErrors({});
      fetchPoojas();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        const errMap = {};
        data.errors.forEach(e => { errMap[e.field] = e.message; });
        setFieldErrors(errMap);
      }
      setMessage(data?.message || 'Error saving pooja. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pooja?')) {
      return;
    }
    try {
      await api.delete(`/poojas/${id}`);
      setMessage('Pooja deleted successfully!');
      fetchPoojas();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting pooja. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPooja(null);
    setFormData({
      name: '',
      description: '',
      timing: '',
      price: '',
      isActive: true,
      image: ''
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Poojas</h1>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="admin-header">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add New Pooja
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingPooja ? 'Edit Pooja' : 'Add New Pooja'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pooja Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Min 2 characters"
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Timing *</label>
                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  placeholder="e.g., 6:00 AM - 8:00 AM"
                />
                {fieldErrors.timing && <span className="field-error">{fieldErrors.timing}</span>}
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
              </div>
              <ImageUpload
                label="Pooja Image (Optional)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active (visible to users)
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPooja ? 'Update' : 'Add'} Pooja
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Timing</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {poojas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No poojas found. Add your first pooja!
                  </td>
                </tr>
              ) : (
                poojas.map(pooja => (
                  <tr key={pooja._id}>
                    <td>{pooja.name}</td>
                    <td>{pooja.timing}</td>
                    <td>₹{pooja.price}</td>
                    <td>
                      <span className={`status ${pooja.isActive ? 'active' : 'inactive'}`}>
                        {pooja.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(pooja)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(pooja._id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
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

export default ManagePoojas;

