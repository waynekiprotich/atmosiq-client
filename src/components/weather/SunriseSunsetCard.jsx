import { useWeather } from '../../context/WeatherContext';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '../../utils/formatters';
import { DaylightArc } from './DaylightArc';
import { motion } from 'framer-motion';

export const SunriseSunsetCard = () => {
  const { weatherData } = useWeather();
  if (!weatherData || !weatherData.current.sys) return null;

  const { sunrise, sunset } = weatherData.current.sys;
  const nowTs = weatherData.current.dt;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-panel rounded-[32px] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[340px] shadow-sm border border-gray-100/50"
    >
      <h3 className="text-sm font-semibold text-gray-800 tracking-wide mb-6">Sun & Moon</h3>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-[240px]">
          <DaylightArc sunriseTs={sunrise} sunsetTs={sunset} nowTs={nowTs} />

          <div className="flex justify-between items-end mt-8 w-full">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Sunrise className="w-4 h-4 text-orange-400" /> Sunrise</span>
              <span className="font-bold text-gray-900 text-xl tracking-tight">{sunrise ? formatTime(sunrise) : '--:--'}</span>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center justify-end gap-1.5"><Sunset className="w-4 h-4 text-orange-600" /> Sunset</span>
              <span className="font-bold text-gray-900 text-xl tracking-tight">{sunset ? formatTime(sunset) : '--:--'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
