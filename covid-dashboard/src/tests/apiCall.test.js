import ApiCall from '../components/ApiCall';

describe('check api call', () => {
  let apiCall;
  beforeAll(async () => {
    apiCall = new ApiCall();
    await apiCall.getPopulation();
    await apiCall.requestSummary();
  });

  it('should check if countries data exists', () => {
    expect(apiCall.countriesDataObject).toBeDefined();
  });

  it('should check if countries data has proper length', () => {
    expect(Object.keys(apiCall.countriesDataObject).length).toEqual(184);
  });

  it('should check if countries data has country Belarus', () => {
    expect(Array.from(Object.entries(apiCall.countriesDataObject)).find(([item]) => item === 'BY')).toBeDefined();
  });
});
