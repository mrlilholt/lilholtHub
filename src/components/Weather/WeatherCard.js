import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'; // Import weather icons

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default location; you can modify this or make it dynamic.
  // const city = 'Langhorne'; // Commented out because it's not used
  // Make sure to set the correct API key in your environment variables
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=19047,us&appid=${apiKey}&units=imperial`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [apiUrl]);

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return <WiDaySunny size={64} />;
      case '02d':
      case '03d':
      case '04d':
        return <WiCloud size={64} />;
      case '09d':
      case '10d':
        return <WiRain size={64} />;
      case '13d':
        return <WiSnow size={64} />;
      case '11d':
        return <WiThunderstorm size={64} />;
      case '50d':
        return <WiFog size={64} />;
      default:
        return <WiDaySunny size={64} />;
    }
  };

  return (
    <div className="weather-card" style={{ textAlign: 'center' }}>
      <img 
        src="/weatherLogo.png" 
        alt="Weather Logo" 
        style={{ height: '60px', marginBottom: '10px' }} 
      />
      {loading && <p>Loading weather data...</p>}
      {error && <p>Error: {error}</p>}
      {weather && !loading && !error && (
        <div>
          <p>Temperature: {weather.main.temp}°F</p>
          <p>Condition: {weather.weather[0].description}</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {getWeatherIcon(weather.weather[0].icon)}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
