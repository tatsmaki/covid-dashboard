class Table {
  constructor(summary) {
    this.summary = summary;
    this.period = 'Total';
    this.relativeAbsoluteValue = 'absolute values';
  }

  getAnotherRelativeAbsoluteValue() {
    if (this.relativeAbsoluteValue === 'absolute values') {
      return 'relative values';
    }
    return 'absolute values';
  }

  setAnotherRelativeAbsoluteValue() {
    this.relativeAbsoluteValue = this.relativeAbsoluteValue === 'absolute values' ? 'relative values' : 'absolute values';
  }

  getAnotherPeriod() {
    if (this.period === 'Total') {
      return 'new day';
    }
    return 'total period';
  }

  setAnotherPeriod() {
    this.period = this.period === 'Total' ? 'New' : 'Total';
  }

  displayTable() {
    this.table = document.createElement('div');
    this.table.classList.add('table');
    return this.setTableData();
  }

  setTableData() {
    this.table.innerHTML = `<span>World statistic for total period with ${this.relativeAbsoluteValue}</span>
        <span>Confirmed: ${this.summary.TotalConfirmed}</span>
        <span>Deaths: ${this.summary.TotalDeaths}</span>
        <span>Recovered: ${this.summary.TotalRecovered}</span>`;
    return this.table;
  }

  renderTable(countryData = this.summary) {
    const worldPopulation = 7827000000;
    const currentPeriod = this.period === 'Total' ? `${this.period.toLowerCase()} period` : `${this.period.toLowerCase()} day`;
    const countryName = countryData.Country ? countryData.Country : 'World';
    const population = countryData.population ? countryData.population : worldPopulation;
    if (this.relativeAbsoluteValue.includes('relative')) {
      const relativeConfirmed = Math.round((countryData[`${this.period}Confirmed`] * 100000) / population);
      const relativeDeaths = Math.round((countryData[`${this.period}Deaths`] * 100000) / population);
      const relativeRecovered = Math.round((countryData[`${this.period}Recovered`] * 100000) / population);
      this.table.innerHTML = `<span>${countryName} statistic for ${currentPeriod} with ${this.relativeAbsoluteValue}</span>
      <span>Confirmed: ${relativeConfirmed}</span>
      <span>Deaths: ${relativeDeaths}</span>
      <span>Recovered: ${relativeRecovered}</span>`;
    } else {
      this.table.innerHTML = `<span>${countryName} statistic for ${currentPeriod} with ${this.relativeAbsoluteValue}</span>
      <span>Confirmed: ${countryData[`${this.period}Confirmed`]}</span>
      <span>Deaths: ${countryData[`${this.period}Deaths`]}</span>
      <span>Recovered: ${countryData[`${this.period}Recovered`]}</span>`;
    }
  }
}

export default Table;
