/**
 * Calculates the percentage of daylight elapsed.
 * @param {number} sunriseTs - Unix timestamp for sunrise (seconds)
 * @param {number} sunsetTs - Unix timestamp for sunset (seconds)
 * @param {number} nowTs - Unix timestamp for current time (seconds)
 * @returns {number} Percentage from 0 to 100
 */
export const getDaylightProgress = (sunriseTs, sunsetTs, nowTs = Math.floor(Date.now() / 1000)) => {
  if (!sunriseTs || !sunsetTs) return 0;
  
  if (nowTs <= sunriseTs) return 0; // Before sunrise
  if (nowTs >= sunsetTs) return 100; // After sunset
  
  const totalDaylightDuration = sunsetTs - sunriseTs;
  const elapsedDaylight = nowTs - sunriseTs;
  
  return (elapsedDaylight / totalDaylightDuration) * 100;
};
