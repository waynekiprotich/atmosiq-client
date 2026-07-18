import { useState } from 'react';
import { Container } from '../components/ui/Container';
import { useSettings } from '../hooks/useSettings';
import { Settings as SettingsIcon, Globe, Thermometer, Wind, Eye, Droplets, Monitor, Download, Upload, Trash2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [importFeedback, setImportFeedback] = useState('');

  const handleUnitChange = (category, value) => {
    updateSettings(prev => ({
      ...prev,
      units: { ...prev.units, [category]: value }
    }));
  };

  const handleFormatChange = (category, value) => {
    updateSettings(prev => ({
      ...prev,
      formats: { ...prev.formats, [category]: value }
    }));
  };

  const handleNotificationChange = (category, checked) => {
    updateSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [category]: checked }
    }));
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importSettings(event.target.result);
      if (success) {
        setImportFeedback('Settings imported successfully.');
        setTimeout(() => setImportFeedback(''), 3000);
      } else {
        setImportFeedback('Failed to import settings.');
        setTimeout(() => setImportFeedback(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'units', label: 'Units', icon: Thermometer },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'data', label: 'Storage & Data', icon: Download },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <Container className="py-8 flex flex-col gap-8 min-h-[80vh]">
      <header>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your preferences, units, and application data.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Settings Content */}
        <main className="flex-1 bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100">
          
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Date & Time Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Time Format</label>
                    <select 
                      value={settings.formats.time}
                      onChange={(e) => handleFormatChange('time', e.target.value)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12h">12-hour (1:00 PM)</option>
                      <option value="24h">24-hour (13:00)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Date Format</label>
                    <select 
                      value={settings.formats.date}
                      onChange={(e) => handleFormatChange('date', e.target.value)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications (UI Preview)</h3>
                <div className="space-y-4">
                  {[
                    { id: 'alerts', label: 'Severe Weather Alerts', desc: 'Get notified about extreme weather conditions.' },
                    { id: 'dailySummary', label: 'Daily Summary', desc: 'A morning briefing of the day ahead.' },
                    { id: 'rainForecast', label: 'Rain Forecast', desc: 'Alerts before precipitation begins.' }
                  ].map(notif => (
                    <label key={notif.id} className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center pt-1">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications[notif.id]}
                          onChange={(e) => handleNotificationChange(notif.id, e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{notif.label}</div>
                        <div className="text-sm text-gray-500">{notif.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'units' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Measurement Units</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Thermometer className="w-4 h-4 text-gray-400" /> Temperature</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      {['celsius', 'fahrenheit'].map(unit => (
                        <button
                          key={unit}
                          onClick={() => handleUnitChange('temperature', unit)}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${settings.units.temperature === unit ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                          {unit === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Wind className="w-4 h-4 text-gray-400" /> Wind Speed</label>
                    <select 
                      value={settings.units.wind}
                      onChange={(e) => handleUnitChange('wind', e.target.value)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kmh">km/h</option>
                      <option value="mph">mph</option>
                      <option value="ms">m/s</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Droplets className="w-4 h-4 text-gray-400" /> Pressure</label>
                    <select 
                      value={settings.units.pressure}
                      onChange={(e) => handleUnitChange('pressure', e.target.value)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hpa">hPa</option>
                      <option value="inhg">inHg</option>
                      <option value="mb">mb</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Eye className="w-4 h-4 text-gray-400" /> Visibility</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      {['km', 'mi'].map(unit => (
                        <button
                          key={unit}
                          onClick={() => handleUnitChange('visibility', unit)}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${settings.units.visibility === unit ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">UI Preferences</h3>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm mb-6">
                  AtmosIQ currently forces a premium Light Mode theme to ensure the best visual experience.
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center pt-1">
                      <input 
                        type="checkbox" 
                        checked={settings.appearance.reducedMotion}
                        onChange={(e) => updateSettings(prev => ({...prev, appearance: {...prev.appearance, reducedMotion: e.target.checked}}))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Reduced Motion</div>
                      <div className="text-sm text-gray-500">Minimize animations and UI transitions.</div>
                    </div>
                  </label>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage & Data</h3>
                <p className="text-sm text-gray-600 mb-6">Your settings, saved cities, and history are stored locally in your browser. You can export them to transfer to another device.</p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={exportSettings}
                    className="flex items-center justify-center gap-2 p-4 w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <Download className="w-5 h-5" /> Export Settings
                  </button>
                  
                  <div className="relative w-full md:w-auto">
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImport}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Import Settings"
                    />
                    <button className="flex items-center justify-center gap-2 p-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors pointer-events-none">
                      <Upload className="w-5 h-5" /> Import Settings
                    </button>
                  </div>
                  {importFeedback && <p className="text-sm text-green-600 font-medium">{importFeedback}</p>}
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all preferences? This cannot be undone.')) {
                      resetSettings();
                    }
                  }}
                  className="flex items-center justify-center gap-2 p-4 w-full md:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="w-5 h-5" /> Reset Preferences
                </button>
              </section>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-4">
                <Globe className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">AtmosIQ</h2>
              <p className="text-gray-500 max-w-md">A premium frontend weather dashboard built for performance, design excellence, and seamless interactivity.</p>
              
              <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-left">
                <div className="text-gray-400 font-medium">Version</div>
                <div className="text-gray-800 font-semibold">1.0.0-rc</div>
                
                <div className="text-gray-400 font-medium">Data Provider</div>
                <div className="text-gray-800 font-semibold">OpenWeatherMap API</div>
                
                <div className="text-gray-400 font-medium">Map Tiles</div>
                <div className="text-gray-800 font-semibold">CartoDB & Leaflet</div>
                
                <div className="text-gray-400 font-medium">Architecture</div>
                <div className="text-gray-800 font-semibold">React + Vite</div>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </Container>
  );
};
