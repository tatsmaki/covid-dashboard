import { hundreedPercent, relativeNumber } from '../constants/const';

export function calculateRelativeData(countryData, population, status, period) {
  return Math.round((countryData[`${period}${status}`] * relativeNumber) / population);
}

export function calculatePercentageData(countryData, population, status, period) {
  return ((countryData[`${period}${status}`] * hundreedPercent) / population).toFixed(3);
}
