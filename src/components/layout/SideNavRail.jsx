import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Map as MapIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import logoIcon from '../../assets/logo-icon.svg';

export const SideNavRail = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/map', icon: MapIcon, label: 'Map' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="fixed md:relative bottom-0 left-0 w-full md:w-24 md:h-screen bg-white/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t md:border-t-0 md:border-r border-gray-200/50 flex md:flex-col items-center justify-between py-3 md:py-8 px-6 md:px-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] md:shadow-none pb-safe">
      
      {/* Top Logo - Hidden on mobile */}
      <div className="hidden md:flex flex-col items-center gap-2 mb-12">
        <Link to="/" className="w-12 h-12 hover:scale-105 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[18px]">
          <img src={logoIcon} alt="AtmosIQ Home" className="w-full h-full" />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex md:flex-col w-full md:w-auto justify-between md:justify-center items-center gap-2 sm:gap-6 md:gap-8 flex-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <div key={item.path} className="relative group/navitem">
              <Link 
                to={item.path} 
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-[20px] transition-all"
                aria-label={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white md:bg-white rounded-[20px] shadow-sm md:shadow-md border border-gray-100/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover/navitem:text-gray-600'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Link>
              
              {/* Tooltip (Desktop Only) */}
              <div className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-2 group-hover/navitem:opacity-100 group-hover/navitem:translate-x-0 transition-all pointer-events-none z-50 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Avatar - Hidden on mobile or pushed to end */}
      <div className="hidden md:flex mt-auto group relative">
        <Link to="/settings" className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:ring-4 hover:ring-blue-100 transition-all cursor-pointer">
          <img src="https://ui-avatars.com/api/?name=User&background=E5E7EB&color=374151" alt="Profile" className="w-full h-full object-cover" />
        </Link>
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-50 whitespace-nowrap">
          Profile Settings
        </div>
      </div>
    </nav>
  );
};
