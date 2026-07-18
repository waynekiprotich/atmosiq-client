import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../context/WeatherContext';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { MapPin, Navigation, Crosshair, Layers, Thermometer, CloudRain, Cloud, Wind } from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to recenter map when active city changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// Coordinate Display Component
const CoordinateDisplay = () => {
  const map = useMap();
  const [coords, setCoords] = useState(map.getCenter());

  useEffect(() => {
    const updateCoords = () => setCoords(map.getCenter());
    map.on('move', updateCoords);
    return () => { map.off('move', updateCoords); };
  }, [map]);

  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-xs font-medium text-gray-600 hidden md:block">
      {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
    </div>
  );
};

export const MapPage = () => {
  const { city, savedCities, loading } = useWeather();
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const layers = [
    { id: 'temp_new', label: 'Temperature', icon: Thermometer, colors: 'from-purple-500 via-green-400 to-red-500', values: ['-40°', '0°', '40°'] },
    { id: 'precipitation_new', label: 'Precipitation', icon: CloudRain, colors: 'from-blue-100 via-blue-500 to-purple-700', values: ['0mm', '10mm', '50mm+'] },
    { id: 'clouds_new', label: 'Clouds', icon: Cloud, colors: 'from-transparent to-gray-400', values: ['0%', '50%', '100%'] },
    { id: 'wind_new', label: 'Wind Speed', icon: Wind, colors: 'from-transparent via-yellow-200 to-purple-600', values: ['0m/s', '10m/s', '30m/s'] },
  ];

  const currentLayerObj = layers.find(l => l.id === activeLayer);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'f0ffdafa65138848eaa2891fa9a7bbc8';

  if (isLoading || loading) {
    return (
      <div className="flex-1 w-full flex flex-col p-4 gap-4">
        <LoadingSkeleton className="h-14 w-full max-w-md rounded-2xl" />
        <LoadingSkeleton className="flex-1 w-full rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative flex flex-col rounded-[32px] overflow-hidden bg-gray-100">
      
      {/* Search Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
        <div className="shadow-2xl shadow-blue-900/10 rounded-2xl bg-white/80 backdrop-blur-xl">
          <SearchBar />
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle map layers"
        >
          <Layers className="w-6 h-6" />
        </button>

        <AnimatePresence>
          {isLayerMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, originTopRight: true }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100 flex flex-col gap-1 w-48"
            >
              {layers.map(layer => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => { setActiveLayer(layer.id); setIsLayerMenuOpen(false); }}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {layer.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg border border-gray-100 w-64">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          {currentLayerObj.label} Overlay
        </h4>
        <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1.5">
          {currentLayerObj.values.map((v, i) => <span key={i}>{v}</span>)}
        </div>
        <div className={`h-2 w-full rounded-full bg-gradient-to-r ${currentLayerObj.colors}`} />
      </div>

      <MapContainer 
        center={[city.lat, city.lon]} 
        zoom={5} 
        zoomControl={true}
        className="flex-1 w-full h-full min-h-[400px] z-0"
      >
        <MapUpdater center={[city.lat, city.lon]} zoom={5} />
        <CoordinateDisplay />
        
        {/* Base Map */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic Weather Overlay */}
        <TileLayer
          key={activeLayer} // Force re-render on change
          url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${apiKey}`}
          opacity={0.65}
        />

        {/* Saved City Markers */}
        {savedCities.map((savedCity) => (
          <Marker 
            key={`${savedCity.lat}-${savedCity.lon}`} 
            position={[savedCity.lat, savedCity.lon]}
          >
            <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
              <div className="p-1">
                <h3 className="font-semibold text-gray-900 mb-1">{savedCity.name}</h3>
                <p className="text-xs text-gray-500 mb-3">Saved Location</p>
                <a href="/" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Navigation className="w-3 h-3" /> Go to Dashboard
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
