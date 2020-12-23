import * as calcHelp from '../helpers/calcHelp';
import {
  totalPeriod,
  newPeriod,
  defaultView,
  worldPopulation,
  defaultInfo,
  confirmedStatus,
  deathsStatus,
  recoveredStatus,
} from '../constants/const';

class Table {
  constructor(summary) {
    this.summary = summary;
    this.period = totalPeriod;
    this.valueType = defaultView;
  }

  setValueType(type) {
    this.valueType = type;
  }

  getPeriod() {
    return this.period;
  }

  setAnotherPeriod() {
    this.period = this.period === totalPeriod ? newPeriod : totalPeriod;
  }

  displayTable() {
    this.table = document.createElement('div');
    this.table.classList.add('table-wrapper');
    this.renderTable();
    return this.table;
  }

  renderTable(countryData = this.summary) {
    const countryName = countryData.Country ? countryData.Country : defaultInfo;
    const population = countryData.population ? countryData.population : worldPopulation;
    let confirmed;
    let deaths;
    let recovered;
    if (this.valueType.includes('relative')) {
      confirmed = calcHelp.calculateRelativeData(
        countryData,
        population,
        confirmedStatus,
        this.period,
      );
      deaths = calcHelp.calculateRelativeData(countryData, population, deathsStatus, this.period);
      recovered = calcHelp.calculateRelativeData(
        countryData,
        population,
        recoveredStatus,
        this.period,
      );
    }
    if (this.valueType.includes('absolute')) {
      confirmed = countryData[`${this.period}${confirmedStatus}`];
      deaths = countryData[`${this.period}${deathsStatus}`];
      recovered = countryData[`${this.period}${recoveredStatus}`];
    }
    if (this.valueType.includes('percentage')) {
      confirmed = calcHelp.calculatePercentageData(
        countryData,
        population,
        confirmedStatus,
        this.period,
      );
      deaths = calcHelp.calculatePercentageData(countryData, population, deathsStatus, this.period);
      recovered = calcHelp.calculatePercentageData(
        countryData,
        population,
        recoveredStatus,
        this.period,
      );
    }
    this.table.innerHTML = `<span class="table-header">${countryName} statistic </span>
      <span>${confirmedStatus}: ${confirmed}</span>
      <span>${deathsStatus}: ${deaths}</span>
      <span>Recovered: ${recovered}</span>`;
  }
}

export default Table;
