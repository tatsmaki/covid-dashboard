import { calculatePercentageData, calculateRelativeData } from '../helpers/calcHelp';

describe('check calculate helper', () => {
  const countryData = {
    TotalConfirmed: 100000,
    TotalDeath: 1000,
    TotalRecovered: 99000,
    NewConfirmed: 1000,
    NewDeaths: 100,
    NewRecovered: 30,
    population: 200000,
  };

  it('should return relative data', () => {
    expect(calculateRelativeData(countryData, countryData.population, 'Death', 'Total')).toBe(500);
  });

  it('should return percentage data', () => {
    expect(calculatePercentageData(countryData, countryData.population, 'Recovered', 'New')).toBe('0.015');
  });
});
