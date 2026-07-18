import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const DaylightArc = ({ sunriseTs, sunsetTs, nowTs }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sunriseTs || !sunsetTs) return;
    
    const current = nowTs || Math.floor(Date.now() / 1000);
    
    if (current <= sunriseTs) {
      setProgress(0);
    } else if (current >= sunsetTs) {
      setProgress(100);
    } else {
      const total = sunsetTs - sunriseTs;
      const elapsed = current - sunriseTs;
      setProgress((elapsed / total) * 100);
    }
  }, [sunriseTs, sunsetTs, nowTs]);

  // SVG parameters
  const r = 80;
  const cx = 100;
  const cy = 90;
  
  const arcLength = Math.PI * r; 
  const dashOffset = arcLength - (progress / 100) * arcLength;

  const angle = Math.PI - (progress / 100) * Math.PI;
  const dotX = cx + r * Math.cos(angle);
  const dotY = cy - r * Math.sin(angle);

  // Dynamic colors based on time
  const isNight = progress === 0 || progress === 100;
  const sunColor = isNight ? '#9CA3AF' : '#F59E0B'; // Gray at night, orange during day
  const pathColor = isNight ? '#D1D5DB' : 'url(#daylightGradient)';

  return (
    <div className="relative w-full flex justify-center items-center mt-4 h-[110px]">
      <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
        <defs>
          <linearGradient id="daylightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE047" /> {/* Morning yellow */}
            <stop offset="50%" stopColor="#F59E0B" /> {/* Noon orange */}
            <stop offset="100%" stopColor="#FB923C" /> {/* Evening warm orange */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Foreground Progress Arc */}
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={pathColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Sun Dot Container to hold rays and core */}
        <motion.g
          initial={{ x: cx - r, y: cy }}
          animate={{ x: dotX, y: dotY }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Animated Glow Rings */}
          {!isNight && (
            <motion.circle
              r="14"
              fill={sunColor}
              opacity="0.2"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {/* Core Sun */}
          <circle
            r="7"
            fill={sunColor}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            className="drop-shadow-md"
          />
        </motion.g>

        {/* Horizon Line */}
        <line x1="10" y1="90" x2="190" y2="90" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};
