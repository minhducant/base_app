const convertMetersToKm = (meters = 0, showUnit = false) => {
  if (!meters || isNaN(meters)) return showUnit ? '0 km' : 0;
  const km = meters / 1000;
  const formatted = km % 1 === 0 ? km : parseFloat(km.toFixed(2));
  return showUnit ? `${formatted} km` : formatted;
};

const convertSecondsToMinutes = (seconds = 0, showUnit = false) => {
  if (!seconds || isNaN(seconds)) return showUnit ? '0 min' : 0;
  const minutes = seconds / 60;
  const formatted =
    minutes % 1 === 0 ? minutes : parseFloat(minutes.toFixed(2));
  return showUnit ? `${formatted} min` : formatted;
};

export { convertMetersToKm, convertSecondsToMinutes };
