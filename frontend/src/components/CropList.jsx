import { useState, useEffect } from 'react';
import { getCrops, createCrop, updateCrop, deleteCrop } from '../services/api';
import '../styles/CropList.css';

function CropList() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    area: '',
    planting_date: '',
    expected_harvest_date: '',
    status: 'planning',
    notes: '',
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await getCrops();
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await updateCrop(editingCrop.id, formData);
      } else {
        await createCrop(formData);
      }
      fetchCrops();
      resetForm();
    } catch (error) {
      console.error('Error saving crop:', error);
      alert('Failed to save crop. Please try again.');
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety || '',
      area: crop.area,
      planting_date: crop.planting_date,
      expected_harvest_date: crop.expected_harvest_date,
      status: crop.status,
      notes: crop.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await deleteCrop(id);
        fetchCrops();
      } catch (error) {
        console.error('Error deleting crop:', error);
        alert('Failed to delete crop.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      area: '',
      planting_date: '',
      expected_harvest_date: '',
      status: 'planning',
      notes: '',
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: '#FFA500',
      planted: '#4CAF50',
      growing: '#2196F3',
      harvested: '#9C27B0',
    };
    return colors[status] || '#666';
  };

  return (
    <div className="crop-list">
      <div className="crop-header">
        <h2>My Crops</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Crop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="crop-form">
          <h3>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Crop Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Wheat, Rice"
              />
            </div>
            <div className="form-group">
              <label>Variety</label>
              <input
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleInputChange}
                placeholder="e.g., Basmati"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Area (acres) *</label>
              <input
                type="number"
                step="0.01"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="planning">Planning</option>
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Planting Date *</label>
              <input
                type="date"
                name="planting_date"
                value={formData.planting_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Harvest Date *</label>
              <input
                type="date"
                name="expected_harvest_date"
                value={formData.expected_harvest_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about this crop..."
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editingCrop ? 'Update Crop' : 'Add Crop'}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading crops...</div>
      ) : crops.length === 0 ? (
        <div className="empty-state">
          <p>No crops added yet. Click "Add Crop" to get started!</p>
        </div>
      ) : (
        <div className="crops-grid">
          {crops.map((crop) => (
            <div key={crop.id} className="crop-card">
              <div className="crop-card-header">
                <h3>{crop.name}</h3>
                <span
                  className="crop-status"
                  style={{ backgroundColor: getStatusColor(crop.status) }}
                >
                  {crop.status}
                </span>
              </div>
              {crop.variety && <p className="crop-variety">Variety: {crop.variety}</p>}
              <div className="crop-details">
                <p><strong>Area:</strong> {crop.area} acres</p>
                <p><strong>Planted:</strong> {new Date(crop.planting_date).toLocaleDateString()}</p>
                <p><strong>Expected Harvest:</strong> {new Date(crop.expected_harvest_date).toLocaleDateString()}</p>
              </div>
              {crop.notes && <p className="crop-notes">{crop.notes}</p>}
              <div className="crop-actions">
                <button className="btn-edit" onClick={() => handleEdit(crop)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(crop.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CropList;
