import React, { useState, useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatTime, formatDay } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-xl border border-gray-100 p-4 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="flex flex-col"><span className="text-gray-400">Temp</span><span className="font-bold text-gray-900 text-sm">{data.temp}°</span></div>
          <div className="flex flex-col"><span className="text-gray-400">Precipitation</span><span className="font-bold text-blue-600 text-sm">{Math.round(data.pop * 100)}%</span></div>
          <div className="flex flex-col"><span className="text-gray-400">Humidity</span><span className="font-bold text-gray-900 text-sm">{data.humidity}%</span></div>
          <div className="flex flex-col"><span className="text-gray-400">Wind</span><span className="font-bold text-gray-900 text-sm">{data.wind_speed}m/s</span></div>
        </div>
      </div>
    );
  }
  return null;
};

export const ForecastChart = React.memo(() => {
  const { weatherData } = useWeather();
  const [timeRange, setTimeRange] = useState('Day'); // 'Day', '3 Days', 'Week'

  const data = useMemo(() => {
    if (!weatherData) return [];
    
    if (timeRange === 'Day') {
      return weatherData.hourly.slice(0, 8).map(hour => ({
        timeStr: formatTime(hour.dt),
        timeTs: hour.dt,
        temp: Math.round(hour.temp),
        pop: hour.pop,
        humidity: hour.humidity || 0,
        wind_speed: hour.wind_speed || 0
      }));
    } else if (timeRange === '3 Days') {
      return weatherData.hourly.slice(0, 24).map(hour => ({
        timeStr: `${formatDay(hour.dt)} ${formatTime(hour.dt)}`,
        timeTs: hour.dt,
        temp: Math.round(hour.temp),
        pop: hour.pop,
        humidity: hour.humidity || 0,
        wind_speed: hour.wind_speed || 0
      }));
    } else {
      // Week
      return weatherData.daily.slice(0, 7).map(day => ({
        timeStr: formatDay(day.dt),
        timeTs: day.dt,
        temp: Math.round(day.temp.max),
        pop: day.pop,
        humidity: day.humidity || 0,
        wind_speed: day.wind_speed || 0
      }));
    }
  }, [weatherData, timeRange]);

  if (!weatherData) return null;

  return (
    <div className="glass-panel rounded-[32px] p-6 lg:p-8 relative flex flex-col h-full min-h-[340px] shadow-sm border border-gray-100/50">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Temperature Forecast</h3>
        
        {/* Animated Toggle */}
        <div role="tablist" aria-label="Forecast Range" className="flex bg-gray-100 p-1.5 rounded-2xl relative">
          {['Day', '3 Days', 'Week'].map(range => (
            <button
              key={range}
              role="tab"
              aria-selected={timeRange === range}
              onClick={() => setTimeRange(range)}
              className="relative px-4 py-1.5 text-xs font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-10"
              style={{ color: timeRange === range ? '#2563EB' : '#6B7280' }}
            >
              {timeRange === range && (
                <motion.div
                  layoutId="chartTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={timeRange}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis 
                  dataKey="timeStr" 
                  stroke="#9CA3AF" 
                  fontSize={11} 
                  fontWeight={500}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#6B7280' }}
                  dy={15}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={11} 
                  fontWeight={500}
                  tickLine={false} 
                  axisLine={false}
                  unit="°"
                  tick={{ fill: '#6B7280' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line 
                  name="Temperature"
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#3B82F6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 2, stroke: '#3B82F6' }}
                  activeDot={{ r: 7, fill: '#3B82F6', strokeWidth: 3, stroke: '#FFFFFF' }}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
