import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Leaf, Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Wind, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  '01d': Sun, '01n': Moon,
  '02d': CloudSun, '02n': CloudMoon,
  '03d': Cloud, '03n': Cloud,
  '04d': Cloud, '04n': Cloud,
  '09d': CloudRain, '09n': CloudRain,
  '10d': CloudRain, '10n': CloudRain,
  '11d': CloudLightning, '11n': CloudLightning,
  '13d': Snowflake, '13n': Snowflake,
  '50d': CloudFog, '50n': CloudFog,
};

export const HeroWeatherCard = React.memo(() => {
  const { weatherData, airQuality, city } = useWeather();
  if (!weatherData) return null;

  const current = weatherData.current;
  const iconCode = current.weather[0].icon;
  const WeatherIcon = iconMap[iconCode] || Sun;
  
  // AQI Mapping
  const aqiValue = airQuality?.list?.[0]?.main?.aqi || 1;
  const aqiMap = {
    1: { label: 'Good', color: 'bg-green-500/30 text-green-50 border-green-400/50', desc: 'Air quality is considered satisfactory.' },
    2: { label: 'Fair', color: 'bg-yellow-500/30 text-yellow-50 border-yellow-400/50', desc: 'Air quality is acceptable.' },
    3: { label: 'Moderate', color: 'bg-orange-500/30 text-orange-50 border-orange-400/50', desc: 'Members of sensitive groups may experience health effects.' },
    4: { label: 'Poor', color: 'bg-red-500/30 text-red-50 border-red-400/50', desc: 'Everyone may begin to experience health effects.' },
    5: { label: 'Very Poor', color: 'bg-purple-500/30 text-purple-50 border-purple-400/50', desc: 'Health warnings of emergency conditions.' },
  };
  const aqiInfo = aqiMap[aqiValue] || aqiMap[1];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={`${city.lat}-${city.lon}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-full min-h-[320px] rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between group"
      >
        {/* Decorative background circle */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" 
        />
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <motion.h2 layoutId={`city-${city.name}`} className="text-2xl font-semibold opacity-95">{city.name}</motion.h2>
            <p className="text-blue-100/80 text-sm mt-1 font-medium tracking-wide">Today</p>
          </div>
          
          {/* AQI Pill */}
          <div className="relative group/tooltip">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md ${aqiInfo.color} border shadow-sm transition-transform hover:scale-105 cursor-help`}>
              <Leaf className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wider uppercase">AQI {aqiInfo.label}</span>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-white text-gray-800 text-xs rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-100">
              <span className="font-bold block mb-1">Air Quality: {aqiValue}/5</span>
              {aqiInfo.desc}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-1 items-end justify-between">
          <div className="flex flex-col justify-end h-full">
            <div className="flex items-start">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-7xl lg:text-8xl font-light tracking-tighter"
              >
                {current?.temp != null ? Math.round(current.temp) : '--'}°
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <WeatherIcon className="w-6 h-6 text-blue-100 drop-shadow-sm" />
                <p className="text-xl font-medium capitalize">{current?.weather?.[0]?.description || 'Unknown'}</p>
              </div>
              <div className="text-blue-100/90 flex flex-wrap gap-4 text-sm font-medium mt-1">
                <span>Feels like {current?.feels_like != null ? Math.round(current.feels_like) : '--'}°</span>
                <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {current?.wind_speed != null ? Math.round(current.wind_speed) : '--'} m/s</span>
                <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {current?.humidity ?? '--'}%</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="hidden sm:flex self-center"
          >
            <WeatherIcon className="w-32 h-32 lg:w-40 lg:h-40 text-white/20 drop-shadow-2xl" strokeWidth={1} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
