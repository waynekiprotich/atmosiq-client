import { useWeather } from '../../context/WeatherContext';
import { CloudRain, Droplets, Eye, Gauge } from 'lucide-react';
import { formatPercent } from '../../utils/formatters';
import { motion } from 'framer-motion';

export const DayDetailsCard = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const current = weatherData.current;
  const today = weatherData.daily[0];

  const details = [
    { label: 'Precipitation', value: today?.pop != null ? formatPercent(today.pop) : '--', icon: CloudRain, sub: 'Daily chance' },
    { label: 'Humidity', value: current?.humidity != null ? `${current.humidity}%` : '--', icon: Droplets, sub: 'Current level' },
    { label: 'Visibility', value: current?.visibility != null ? `${(current.visibility / 1000).toFixed(1)} km` : '--', icon: Eye, sub: current?.visibility > 5000 ? 'Clear view' : current?.visibility == null ? '--' : 'Hazy' },
    { label: 'Pressure', value: current?.pressure != null ? `${current.pressure} hPa` : '--', icon: Gauge, sub: 'Sea level' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="glass-panel rounded-[32px] p-6 lg:p-8 h-full min-h-[340px] flex flex-col shadow-sm border border-gray-100/50">
      <h3 className="text-sm font-semibold text-gray-800 tracking-wide mb-8">Day Details</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-y-10 gap-x-8 flex-1 content-center"
      >
        {details.map((detail, idx) => {
          const Icon = detail.icon;
          return (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col gap-2 p-3 rounded-2xl hover:bg-gray-50/50 transition-colors cursor-default"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Icon className="w-4 h-4" />
                </div>
                {detail.label}
              </div>
              <div className="pl-1 mt-1">
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{detail.value}</div>
                <div className="text-xs text-gray-500 mt-1.5 font-medium">{detail.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
