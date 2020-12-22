export function calculateRelativeData(countryData, population, status, period) {
  return Math.round((countryData[`${period}${status}`] * 100000) / population);
}

export function calculatePercentageData(countryData, population, status, period) {
  return ((countryData[`${period}${status}`] * 100) / population).toFixed(3);
}
