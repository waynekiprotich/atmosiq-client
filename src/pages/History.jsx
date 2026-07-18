import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { useWeather } from '../context/WeatherContext';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { History as HistoryIcon, MapPin, Search, Trash2, ArrowRight } from 'lucide-react';

export const History = () => {
  const { savedCities, recentlyViewed, recentSearches, setCity, clearSearchHistory, fetchWeather } = useWeather();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Fake a loading state for smooth entry
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCityClick = (city) => {
    setCity(city);
    fetchWeather(city);
    navigate('/');
  };

  if (isLoading) {
    return (
      <Container className="py-8 space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-48 rounded-lg mb-4" />
          <LoadingSkeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoadingSkeleton className="h-64 w-full rounded-3xl" />
          <LoadingSkeleton className="h-64 w-full rounded-3xl" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Your History</h1>
        <p className="text-gray-500 mt-2">Manage your recently viewed locations and past searches.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recently Viewed Cities */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-800">Recently Viewed</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.map((city, index) => (
                <motion.button
                  key={`${city.name}-${city.lat}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCityClick(city)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{city.name}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </motion.button>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No recent views</p>
                <p className="text-sm text-gray-400 mt-1">Cities you view will appear here.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Searches */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-medium text-gray-800">Recent Searches</h2>
            </div>
            {recentSearches.length > 0 && (
              <button 
                onClick={clearSearchHistory}
                className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 focus:outline-none focus:underline"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <motion.div
                  key={`${search}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50"
                >
                  <HistoryIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-600">{search}</span>
                </motion.div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No recent searches</p>
                <p className="text-sm text-gray-400 mt-1">Your search queries will be saved here.</p>
              </div>
            )}
          </div>
        </section>
        
      </div>
    </Container>
  );
};
