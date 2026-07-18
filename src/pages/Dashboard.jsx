import { useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { useWeather } from '../context/WeatherContext';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';

import { CityTabs } from '../components/weather/CityTabs';
import { HeroWeatherCard } from '../components/weather/HeroWeatherCard';
import { ForecastChart } from '../components/weather/ForecastChart';
import { DayDetailsCard } from '../components/weather/DayDetailsCard';
import { SunriseSunsetCard } from '../components/weather/SunriseSunsetCard';
import { MapPreviewCard } from '../components/weather/MapPreviewCard';

export const Dashboard = () => {
  const { city, fetchWeather, weatherData, loading, error } = useWeather();

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city, fetchWeather]);

  if (loading && !weatherData) {
    return (
      <Container className="py-6 flex flex-col gap-6 w-full animate-pulse">
        {/* Top Row: Tabs Skeleton */}
        <div className="flex gap-2 w-full overflow-hidden">
          <LoadingSkeleton className="h-10 w-24 rounded-full" />
          <LoadingSkeleton className="h-10 w-24 rounded-full" />
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
        </div>
        
        {/* Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-[340px]">
            <LoadingSkeleton className="w-full h-full rounded-3xl" />
          </div>
          <div className="lg:col-span-8 h-[340px]">
            <LoadingSkeleton className="w-full h-full rounded-3xl" />
          </div>
        </div>
        
        {/* Grid Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          <div className="md:col-span-1 lg:col-span-4 h-[280px]">
            <LoadingSkeleton className="w-full h-full rounded-3xl" />
          </div>
          <div className="md:col-span-1 lg:col-span-4 h-[280px]">
            <LoadingSkeleton className="w-full h-full rounded-3xl" />
          </div>
          <div className="md:col-span-1 lg:col-span-4 h-[280px]">
            <LoadingSkeleton className="w-full h-full rounded-3xl" />
          </div>
        </div>
      </Container>
    );
  }

  if (error && !weatherData) {
    return <Container className="py-8"><ErrorState message={error} /></Container>;
  }

  return (
    <Container className="py-6 flex flex-col gap-6">
      {/* Top Row: Tabs */}
      <CityTabs />
      
      {/* Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <HeroWeatherCard />
        </div>
        <div className="lg:col-span-8">
          <ForecastChart />
        </div>
      </div>
      
      {/* Grid Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        <div className="md:col-span-1 lg:col-span-4">
          <DayDetailsCard />
        </div>
        <div className="md:col-span-1 lg:col-span-4">
          <SunriseSunsetCard />
        </div>
        <div className="md:col-span-1 lg:col-span-4">
          <MapPreviewCard />
        </div>
      </div>
    </Container>
  );
};