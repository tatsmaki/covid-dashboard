import * as calcHelp from '../helpers/calcHelp';

class Table {
  constructor(summary) {
    this.summary = summary;
    this.period = 'Total';
    this.valueType = 'absolute values';
  }

  setValueType(type) {
    this.valueType = type;
  }

  getAnotherPeriod() {
    if (this.period === 'Total') {
      return 'New';
    }
    return 'Total';
  }

  setAnotherPeriod() {
    this.period = this.period === 'Total' ? 'New' : 'Total';
  }

  displayTable() {
    this.table = document.createElement('div');
    this.table.classList.add('table-wrapper');
    this.renderTable();
    return this.table;
  }

  renderTable(countryData = this.summary) {
    const worldPopulation = 7827000000;
    const currentPeriod = this.period === 'Total' ? `${this.period.toLowerCase()} period` : `${this.period.toLowerCase()} day`;
    const countryName = countryData.Country ? countryData.Country : 'World';
    const population = countryData.population ? countryData.population : worldPopulation;
    let confirmed;
    let deaths;
    let recovered;
    if (this.valueType.includes('relative')) {
      confirmed = calcHelp.calculateRelativeData(countryData, population, 'Confirmed', this.period);
      deaths = calcHelp.calculateRelativeData(countryData, population, 'Deaths', this.period);
      recovered = calcHelp.calculateRelativeData(countryData, population, 'Recovered', this.period);
    }
    if (this.valueType.includes('absolute')) {
      confirmed = countryData[`${this.period}Confirmed`];
      deaths = countryData[`${this.period}Deaths`];
      recovered = countryData[`${this.period}Recovered`];
    }
    if (this.valueType.includes('percentage')) {
      confirmed = calcHelp.calculatePercentageData(countryData, population, 'Confirmed', this.period);
      deaths = calcHelp.calculatePercentageData(countryData, population, 'Deaths', this.period);
      recovered = calcHelp.calculatePercentageData(countryData, population, 'Recovered', this.period);
    }
    this.table.innerHTML = `<span class="table-header">${countryName} statistic </span>
      <span class="table-parameters">( ${currentPeriod} and ${this.valueType} selected)</span>
      <span>Confirmed: ${confirmed}</span>
      <span>Deaths: ${deaths}</span>
      <span>Recovered: ${recovered}</span>`;
  }
}

export default Table;
