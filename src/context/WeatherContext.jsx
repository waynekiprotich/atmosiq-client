import { createContext, useContext, useState, useCallback } from 'react';
import { WeatherService } from '../services/weatherApi';

const WeatherContext = createContext(null);

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize saved cities from localStorage, or default to SF
  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem('atmosiq_saved_cities');
    return saved ? JSON.parse(saved) : [{ name: 'San Francisco', lat: 37.7749, lon: -122.4194 }];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const viewed = localStorage.getItem('atmosiq_recent_viewed');
    return viewed ? JSON.parse(viewed) : [];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const searches = localStorage.getItem('atmosiq_recent_searches');
    return searches ? JSON.parse(searches) : [];
  });

  // Active city is always the first one if not set, but we allow selecting
  const [city, setCityState] = useState(savedCities[0]);

  const setCity = useCallback((newCity) => {
    setCityState(newCity);
    setRecentlyViewed(prev => {
      // Remove if it exists to move it to the front
      const filtered = prev.filter(c => !(c.name === newCity.name && c.lat === newCity.lat));
      const next = [newCity, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem('atmosiq_recent_viewed', JSON.stringify(next));
      return next;
    });
  }, []);

  const addSearchToHistory = useCallback((searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== searchQuery.toLowerCase());
      const next = [searchQuery, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem('atmosiq_recent_searches', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('atmosiq_recent_searches');
  }, []);

  // Persist saved cities to localStorage whenever they change
  const updateSavedCities = useCallback((newCities) => {
    setSavedCities(newCities);
    localStorage.setItem('atmosiq_saved_cities', JSON.stringify(newCities));
  }, []);

  const addCity = (newCity) => {
    // Prevent duplicates
    if (!savedCities.find(c => c.name === newCity.name && c.lat === newCity.lat)) {
      updateSavedCities([...savedCities, newCity]);
    }
    setCity(newCity);
  };

  const removeCity = (cityToRemove) => {
    const updated = savedCities.filter(c => !(c.name === cityToRemove.name && c.lat === cityToRemove.lat));
    if (updated.length === 0) {
      // Don't allow removing the last city, or reset to a default
      updated.push({ name: 'London', lat: 51.5074, lon: -0.1278 });
    }
    updateSavedCities(updated);
    if (city.name === cityToRemove.name) {
      setCity(updated[0]);
    }
  };

  const fetchWeather = useCallback(async (selectedCity) => {
    setLoading(true);
    setError(null);
    try {
      const [forecast, air] = await Promise.all([
        WeatherService.getForecast(selectedCity.lat, selectedCity.lon),
        WeatherService.getAirQuality(selectedCity.lat, selectedCity.lon)
      ]);
      
      setWeatherData(forecast);
      setAirQuality(air);
      setCity(selectedCity);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WeatherContext.Provider value={{ 
      weatherData, 
      airQuality, 
      city, 
      savedCities,
      recentlyViewed,
      recentSearches,
      addCity,
      removeCity,
      setCity,
      addSearchToHistory,
      clearSearchHistory,
      loading, 
      error, 
      fetchWeather 
    }}>
      {children}
    </WeatherContext.Provider>
  );
};