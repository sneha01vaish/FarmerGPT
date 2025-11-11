import { useState } from 'react';
import { getCropSuggestions } from '../services/api';
import '../styles/CropSuggestions.css';

function CropSuggestions() {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');

  const availableCrops = ['wheat', 'rice', 'corn', 'cotton', 'tomato'];

  const handleCropSelect = async (crop) => {
    setSelectedCrop(crop);
    setLoading(true);
    try {
      const response = await getCropSuggestions(crop);
      setSuggestions(response.data.crop);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-suggestions">
      <h2>Crop Suggestions & Tips</h2>

      <div className="crop-selector">
        <p>Select a crop to view farming tips and best practices:</p>
        <div className="crop-buttons">
          {availableCrops.map((crop) => (
            <button
              key={crop}
              className={`crop-btn ${selectedCrop === crop ? 'active' : ''}`}
              onClick={() => handleCropSelect(crop)}
            >
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading suggestions...</div>}

      {!loading && suggestions && (
        <div className="suggestions-content">
          <h3>{suggestions.name}</h3>

          <div className="suggestion-section">
            <h4>Basic Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Best Season:</span>
                <span className="info-value">{suggestions.best_season}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Temperature:</span>
                <span className="info-value">{suggestions.temperature}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration:</span>
                <span className="info-value">{suggestions.duration}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Soil Type:</span>
                <span className="info-value">{suggestions.soil}</span>
              </div>
            </div>
          </div>

          <div className="suggestion-section">
            <h4>Water Requirements</h4>
            <p>{suggestions.water}</p>
          </div>

          <div className="suggestion-section">
            <h4>Farming Tips</h4>
            <ul className="tips-list">
              {suggestions.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="suggestion-section">
            <h4>Common Diseases to Watch For</h4>
            <div className="diseases-list">
              {suggestions.diseases.map((disease, index) => (
                <span key={index} className="disease-tag">
                  {disease}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && !suggestions && (
        <div className="empty-state">
          <p>Select a crop above to view detailed farming suggestions and tips.</p>
        </div>
      )}
    </div>
  );
}

export default CropSuggestions;
