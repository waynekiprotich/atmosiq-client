import { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { MapPin, Plus, X } from 'lucide-react';
import { SearchDropdown } from '../search/SearchDropdown';

export const CityTabs = () => {
  const { savedCities, city, setCity, removeCity, addCity } = useWeather();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div role="tablist" aria-label="Saved Cities" className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
      {savedCities.map((savedCity, idx) => {
        const isActive = city.name === savedCity.name && city.lat === savedCity.lat;
        return (
          <button 
            key={`${savedCity.lat}-${savedCity.lon}`}
            role="tab"
            aria-selected={isActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive 
                ? 'bg-[#111827] text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setCity(savedCity)}
          >
            {idx === 0 && <MapPin className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />}
            <span className="font-medium text-sm">{savedCity.name}</span>
            {idx !== 0 && (
              <div 
                role="button"
                aria-label={`Remove ${savedCity.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeCity(savedCity);
                }}
                className={`ml-1 p-0.5 rounded-full ${isActive ? 'hover:bg-white/20' : 'hover:bg-gray-200'} transition-colors focus:outline-none focus:ring-2 focus:ring-red-400`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); removeCity(savedCity); } }}
              >
                <X className="w-3 h-3" />
              </div>
            )}
          </button>
        );
      })}

      {isAdding ? (
        <div className="relative flex-shrink-0 min-w-[200px] z-50">
          <SearchDropdown 
            onSelect={(newCity) => {
              addCity(newCity);
              setIsAdding(false);
            }} 
          />
          <button 
            onClick={() => setIsAdding(false)}
            aria-label="Cancel adding city"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          aria-label="Add new city"
          className="flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Add city</span>
        </button>
      )}
    </div>
  );
};
