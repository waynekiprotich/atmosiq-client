import axios from 'axios';

// Base API setup. In the future, this base URL points to your custom backend.
const apiClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_WEATHER_API_KEY || 'dummy_key',
    units: 'metric',
  },
});

// A dummy fallback to allow UI development without a real API key.
// When you swap to your backend, remove this fallback entirely.
const mockData = {
  current: { dt: Math.floor(Date.now() / 1000), temp: 21, feels_like: 20, humidity: 45, wind_speed: 12, pressure: 1012, visibility: 10000, uvi: 4, clouds: 25, weather: [{ main: 'Clear', description: 'Clear sky', icon: '01d' }], sys: { sunrise: 1678000000, sunset: 1678040000 } },
  hourly: Array(24).fill(0).map((_, i) => ({ dt: Math.floor(Date.now() / 1000) + i * 3600, temp: 20 + Math.sin(i / 3) * 3, pop: Math.random() * 0.5 })),
  daily: Array(7).fill(0).map((_, i) => ({ dt: Math.floor(Date.now() / 1000) + i * 86400, temp: { max: 22 + i, min: 15 - i }, weather: [{ main: 'Cloudy' }], pop: Math.random() * 0.8 })),
  air: { main: { aqi: 2 }, components: { pm2_5: 12.5, pm10: 20.1, no2: 15.3 } }
};

export const WeatherService = {
  async getCurrentWeather(lat, lon) {
    try {
      const res = await apiClient.get('/weather', { params: { lat, lon } });
      return res.data;
    } catch (err) {
      console.warn('Falling back to mock current data. Provide valid VITE_WEATHER_API_KEY.');
      return { ...mockData.current, name: 'San Francisco', coord: { lat, lon } };
    }
  },

  async getForecast(lat, lon) {
    try {
      const res = await apiClient.get('/onecall', { params: { lat, lon, exclude: 'minutely,alerts' } });
      return res.data;
    } catch (err) {
      console.warn('Falling back to mock forecast data.');
      return mockData;
    }
  },

  async getAirQuality(lat, lon) {
    try {
      const res = await apiClient.get('/air_pollution', { params: { lat, lon } });
      return res.data.list[0];
    } catch (err) {
      console.warn('Falling back to mock air quality data.');
      return mockData.air;
    }
  },

  async searchCity(query) {
    try {
      const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: { q: query, limit: 5, appid: import.meta.env.VITE_WEATHER_API_KEY || 'dummy_key' }
      });
      return res.data;
    } catch (err) {
      return [{ name: 'San Francisco', lat: 37.77, lon: -122.41, country: 'US' }];
    }
  }
};