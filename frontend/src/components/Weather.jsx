import { useState, useEffect } from 'react';
import { getWeather } from '../services/api';
import '../styles/Weather.css';

function Weather({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState(location || 'Delhi');

  useEffect(() => {
    if (searchLocation) {
      fetchWeather(searchLocation);
    }
  }, [searchLocation]);

  const fetchWeather = async (loc) => {
    setLoading(true);
    setError('');
    try {
      const response = await getWeather(loc);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const loc = e.target.location.value;
    if (loc) {
      setSearchLocation(loc);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="weather-widget">
      <h2>Weather Information</h2>

      <form onSubmit={handleSearch} className="weather-search">
        <input
          type="text"
          name="location"
          placeholder="Enter location..."
          defaultValue={searchLocation}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="loading">Loading weather data...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && weather && (
        <>
          <div className="current-weather">
            <h3>{weather.location}</h3>
            <div className="weather-main">
              <div className="weather-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                  alt={weather.current.description}
                />
              </div>
              <div className="weather-temp">
                <span className="temp-value">{Math.round(weather.current.temperature)}°C</span>
                <p className="weather-desc">{weather.current.description}</p>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(weather.current.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.current.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.current.wind_speed} m/s</span>
              </div>
            </div>
          </div>

          <div className="weather-forecast">
            <h4>Upcoming Forecast</h4>
            <div className="forecast-list">
              {weather.forecast?.slice(0, 5).map((item, index) => (
                <div key={index} className="forecast-item">
                  <p className="forecast-time">{formatTime(item.dt)}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                  />
                  <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
                  <p className="forecast-desc">{item.weather[0].main}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
