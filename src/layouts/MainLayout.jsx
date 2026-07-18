import { Outlet, useLocation } from 'react-router-dom';
import { SideNavRail } from '../components/layout/SideNavRail';
import { Footer } from '../components/layout/Footer';
import { AnimatePresence, motion } from 'framer-motion';

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EEF1F6]">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg focus:shadow-lg">
        Skip to content
      </a>

      <SideNavRail />
      
      <main className="flex-1 p-2 md:p-6 pb-24 md:pb-6 overflow-hidden flex flex-col">
        <div className="bg-[#F7F8FA] w-full h-full rounded-[32px] shadow-sm overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full overflow-y-auto"
              id="main-content"
              tabIndex={-1}
            >
              <Outlet />
              <Footer />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};