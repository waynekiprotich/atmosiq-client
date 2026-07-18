export const formatTime = (timestamp) => {
  if (timestamp === undefined || timestamp === null) return '—';
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const formatDay = (timestamp) => {
  if (timestamp === undefined || timestamp === null) return '—';
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString([], { weekday: 'short' });
};

export const formatTemperature = (temp) => {
  if (temp === undefined || temp === null || isNaN(temp)) return '—';
  return `${Math.round(temp)}°`;
};

export const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return `${Math.round(value * 100)}%`;
};

export const formatDateString = (timestamp) => {
  if (timestamp === undefined || timestamp === null) return '—';
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
};