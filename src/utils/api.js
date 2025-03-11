// src/utils/api.js

/**
 * Fetches current weather data for a given city using the OpenWeatherMap API.
 *
 * @param {string} city - The name of the city to fetch weather data for.
 * @returns {Promise<Object>} - A promise that resolves to the weather data object.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const fetchWeather = async (city) => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=imperial&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in fetchWeather:', error);
      throw error;
    }
  };
  
  // Add additional API utility functions below as needed.
  