import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';
import Weather from '../components/Weather';
import CropList from '../components/CropList';
import CropSuggestions from '../components/CropSuggestions';
import Chatbot from '../components/Chatbot';
import '../styles/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching user:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>FarmerGPT</h1>
          <p className="tagline">Smart Farming Assistant</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <div>
              <p className="user-name">{user?.first_name} {user?.last_name}</p>
              <p className="user-location">{profile?.location || 'Location not set'}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-section weather-section">
            <Weather location={profile?.location} />
          </div>

          <div className="dashboard-section crops-section">
            <CropList />
          </div>

          <div className="dashboard-section suggestions-section">
            <CropSuggestions />
          </div>

          <div className="dashboard-section chatbot-section">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
