import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

// Lazy load pages for performance
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const History = React.lazy(() => import('../pages/History').then(module => ({ default: module.History })));
const MapPage = React.lazy(() => import('../pages/Map').then(module => ({ default: module.MapPage })));
const Settings = React.lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
const NotFound = React.lazy(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

// Fallback skeleton while chunk loads
const PageFallback = () => (
  <div className="w-full h-full p-8 flex flex-col gap-6">
    <LoadingSkeleton className="h-12 w-1/3 rounded-full" />
    <LoadingSkeleton className="h-64 w-full rounded-3xl" />
    <div className="grid grid-cols-2 gap-6">
      <LoadingSkeleton className="h-48 w-full rounded-3xl" />
      <LoadingSkeleton className="h-48 w-full rounded-3xl" />
    </div>
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);