export const mapCondition = (apiCondition) => {
  if (!apiCondition || !apiCondition.weather || !apiCondition.weather[0]) {
    return { condition: 'clear', isDay: true };
  }
  
  const main = apiCondition.weather[0].main.toLowerCase();
  const iconCode = apiCondition.weather[0].icon || '01d'; // Fallback to day icon
  const isDay = !iconCode.endsWith('n'); // OpenWeatherMap uses 'n' suffix for night icons

  let condition = 'clear';

  if (main.includes('thunderstorm')) condition = 'thunderstorm';
  else if (main.includes('drizzle')) condition = 'drizzle';
  else if (main.includes('rain')) condition = 'rain';
  else if (main.includes('snow')) condition = 'snow';
  else if (main.includes('clouds')) condition = 'clouds';
  else if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado'].includes(main)) condition = 'mist';

  return { condition, isDay };
};