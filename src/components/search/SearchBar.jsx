import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import { WeatherService } from '../../services/weatherApi';
import { SearchDropdown } from './SearchDropdown';
import { useWeather } from '../../context/WeatherContext';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const { fetchWeather, addSearchToHistory, recentlyViewed } = useWeather();

  useEffect(() => {
    // Click outside to close
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }
    setIsLoading(true);
    WeatherService.searchCity(debouncedQuery)
      .then(data => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const handleSelect = (city) => {
    addSearchToHistory(city.name);
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    fetchWeather(city);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown') setIsDropdownOpen(true);
      return;
    }

    const itemsCount = query.trim() === '' ? recentlyViewed.length : results.length;
    if (itemsCount === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < itemsCount - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < itemsCount) {
        const item = query.trim() === '' ? recentlyViewed[selectedIndex] : results[selectedIndex];
        handleSelect(item);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  const displayResults = query.trim() === '' ? recentlyViewed : results;
  const showRecentViewed = query.trim() === '' && recentlyViewed.length > 0;

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md z-[100]">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-textSecondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsDropdownOpen(true); }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-200 shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-textSecondary hover:text-white transition-colors" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isDropdownOpen && (query !== '' || showRecentViewed) && (
          <SearchDropdown 
            results={displayResults} 
            isLoading={isLoading && query !== ''} 
            onSelect={handleSelect} 
            emptyState={query !== '' && !isLoading && results.length === 0}
            selectedIndex={selectedIndex}
            isRecent={showRecentViewed}
            query={query}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
