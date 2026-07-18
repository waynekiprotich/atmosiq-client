import { BrowserRouter } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <WeatherProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </WeatherProvider>
  );
}