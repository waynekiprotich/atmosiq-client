const SETTINGS_KEY = 'atmosiq_settings';

export const defaultSettings = {
  units: {
    temperature: 'celsius', // celsius, fahrenheit, kelvin
    wind: 'kmh',            // kmh, mph, ms
    pressure: 'hpa',        // hpa, inhg, mb
    visibility: 'km'        // km, mi
  },
  formats: {
    time: '24h',            // 12h, 24h
    date: 'DD/MM/YYYY',     // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
    language: 'en'
  },
  notifications: {
    alerts: true,
    dailySummary: false,
    rainForecast: true
  },
  appearance: {
    theme: 'light',         // Currently only light supported in UI
    reducedMotion: false,
    compactMode: false
  }
};

export const settingsStorage = {
  get: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return defaultSettings;
      
      const parsed = JSON.parse(stored);
      // Deep merge with defaults to ensure new keys exist
      return {
        ...defaultSettings,
        ...parsed,
        units: { ...defaultSettings.units, ...(parsed.units || {}) },
        formats: { ...defaultSettings.formats, ...(parsed.formats || {}) },
        notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
        appearance: { ...defaultSettings.appearance, ...(parsed.appearance || {}) }
      };
    } catch (e) {
      console.error('Failed to parse settings', e);
      return defaultSettings;
    }
  },
  
  set: (newSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      window.dispatchEvent(new Event('atmosiq_settings_updated'));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  reset: () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      window.dispatchEvent(new Event('atmosiq_settings_updated'));
    } catch (e) {
      console.error('Failed to reset settings', e);
    }
  },

  export: () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsStorage.get(), null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "atmosiq_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },

  import: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      // Validation could go here
      settingsStorage.set(parsed);
      return true;
    } catch (e) {
      console.error('Failed to import settings', e);
      return false;
    }
  }
};
