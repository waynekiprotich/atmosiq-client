import { motion, AnimatePresence } from 'framer-motion';
import { X, CloudRain, Droplets, Wind, Leaf } from 'lucide-react';
import { formatTime, formatPercent } from '../../utils/formatters';

export const TimeDetailsPopover = ({ activeData, onClose }) => {
  if (!activeData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute bottom-[80%] left-1/2 -translate-x-1/2 min-w-[200px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-4 z-50"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-800 text-sm">
            {formatTime(activeData.timeTs)}
          </span>
          <button 
            onClick={onClose}
            aria-label="Close details"
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5" /> Precip</span>
            <span className="font-medium text-gray-800">{formatPercent(activeData.pop)}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" /> Humidity</span>
            <span className="font-medium text-gray-800">{activeData.humidity}%</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /> Wind</span>
            <span className="font-medium text-gray-800">{Math.round(activeData.wind_speed)} mph</span>
          </div>
          
          {/* Note: Forecast data from OpenWeather doesn't easily provide hourly AQI on the free tier,
              so we just use the current AQI or omit it if unavailable for the specific hour. */}
        </div>
        
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />
      </motion.div>
    </AnimatePresence>
  );
};
