import { motion } from 'framer-motion';
import { MapPin, History, SearchX } from 'lucide-react';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

export const SearchDropdown = ({ results, isLoading, onSelect, emptyState, selectedIndex, isRecent, query }) => {
  
  // Highlight matching text function
  const highlightMatch = (text, q) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === q.toLowerCase() ? <span key={index} className="text-blue-600 font-bold">{part}</span> : part
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl"
    >
      {isRecent && !isLoading && results.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" /> Recently Viewed
        </div>
      )}

      {isLoading ? (
        <div className="p-3 space-y-2">
          <LoadingSkeleton className="h-10 w-full rounded-xl" />
          <LoadingSkeleton className="h-10 w-full rounded-xl" />
        </div>
      ) : emptyState ? (
        <div className="p-6 text-sm text-gray-500 flex flex-col items-center justify-center text-center">
          <SearchX className="w-8 h-8 text-gray-300 mb-2" />
          <p>No cities found matching "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">Try a different spelling or larger city nearby.</p>
        </div>
      ) : (
        <ul className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {results.map((city, idx) => (
            <li key={`${city.lat}-${city.lon}-${idx}`}>
              <button 
                onClick={() => onSelect(city)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 text-left ${selectedIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className={`p-2 rounded-xl ${selectedIndex === idx ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {isRecent ? <History className={`w-4 h-4 ${selectedIndex === idx ? 'text-blue-600' : 'text-gray-500'}`} /> : <MapPin className={`w-4 h-4 ${selectedIndex === idx ? 'text-blue-600' : 'text-gray-500'}`} />}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-gray-900 font-medium">{highlightMatch(city.name, query)}</span>
                  <span className="text-gray-500 text-xs">{city.state ? `${city.state}, ` : ''}{city.country}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};