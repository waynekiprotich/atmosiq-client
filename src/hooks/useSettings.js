import { useState, useEffect, useCallback } from 'react';
import { settingsStorage } from '../utils/settingsStorage';

export const useSettings = () => {
  const [settings, setSettingsState] = useState(settingsStorage.get());

  useEffect(() => {
    const handleStorageChange = () => {
      setSettingsState(settingsStorage.get());
    };

    window.addEventListener('atmosiq_settings_updated', handleStorageChange);
    // Also listen to cross-tab storage events
    window.addEventListener('storage', (e) => {
      if (e.key === 'atmosiq_settings') {
        handleStorageChange();
      }
    });

    return () => {
      window.removeEventListener('atmosiq_settings_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateSettings = useCallback((updater) => {
    const current = settingsStorage.get();
    const next = typeof updater === 'function' ? updater(current) : updater;
    settingsStorage.set(next);
  }, []);

  const resetSettings = useCallback(() => {
    settingsStorage.reset();
  }, []);

  const exportSettings = useCallback(() => {
    settingsStorage.export();
  }, []);

  const importSettings = useCallback((jsonString) => {
    return settingsStorage.import(jsonString);
  }, []);

  return { 
    settings, 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings 
  };
};
