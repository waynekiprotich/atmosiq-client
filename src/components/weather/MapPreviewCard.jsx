import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../../context/WeatherContext';
import { Maximize2, X, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Fix for default Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const MapPreviewCard = () => {
  const { city } = useWeather();
  const [isExpanded, setIsExpanded] = useState(false);
  const [layer, setLayer] = useState('temp_new');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Key the map container so it re-initializes properly when the city changes
  const mapKey = `${city.lat}-${city.lon}-${layer}`;

  return (
    <>
      {/* Small Preview Card */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="glass-panel rounded-[32px] overflow-hidden relative flex flex-col h-[340px] shadow-sm border border-gray-100/50"
      >
        <div className="p-6 pb-4 flex justify-between items-center z-10 bg-gradient-to-b from-white/95 via-white/80 to-transparent absolute top-0 w-full">
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Global Map</h3>
          <button 
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-white shadow-sm border border-gray-200 px-4 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Expand
          </button>
        </div>
        
        <div className="flex-1 w-full relative z-0 mt-0">
          <MapContainer 
            key={mapKey}
            center={[city.lat, city.lon]} 
            zoom={6} 
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            className="w-full h-full rounded-b-[32px]"
          >
            {/* Standard Light Tileset */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {/* OWM Layer */}
            <TileLayer
              url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY || 'f0ffdafa65138848eaa2891fa9a7bbc8'}`}
              opacity={0.65}
            />
            <Marker position={[city.lat, city.lon]} />
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 z-10">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <span>-40°</span>
            <span>0°</span>
            <span>40°</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-purple-500 via-blue-400 via-green-400 via-yellow-400 to-red-500" />
        </div>
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl h-full max-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-5 px-8 border-b border-gray-100 bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-800">Interactive Map</h3>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowLayerMenu(!showLayerMenu)}
                      aria-expanded={showLayerMenu}
                      aria-haspopup="true"
                      aria-label="Map layers"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Layers className="w-4 h-4 text-gray-500" /> Layers
                    </button>
                    {showLayerMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[150px] z-[1000]" role="menu">
                        {[
                          { id: 'temp_new', label: 'Temperature' },
                          { id: 'precipitation_new', label: 'Precipitation' },
                          { id: 'clouds_new', label: 'Clouds' }
                        ].map(l => (
                          <button
                            key={l.id}
                            role="menuitem"
                            onClick={() => { setLayer(l.id); setShowLayerMenu(false); }}
                            className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${layer === l.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    aria-label="Close interactive map"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 w-full bg-gray-100 relative z-0">
                <MapContainer 
                  key={`expanded-${mapKey}`}
                  center={[city.lat, city.lon]} 
                  zoom={6} 
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY || 'f0ffdafa65138848eaa2891fa9a7bbc8'}`}
                    opacity={0.7}
                  />
                  <Marker position={[city.lat, city.lon]} />
                </MapContainer>
                
                {/* Expanded Legend */}
                {layer === 'temp_new' && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl border border-gray-100 z-[1000] min-w-[400px]">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 tracking-wider">
                      <span>-40°</span>
                      <span>-20°</span>
                      <span>0°</span>
                      <span>20°</span>
                      <span>40°</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-purple-500 via-blue-400 via-green-400 via-yellow-400 to-red-500" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
