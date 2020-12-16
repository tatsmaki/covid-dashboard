class Table {
  constructor(summary) {
    this.summary = summary;
  }

  displayTable() {
    this.table = document.createElement('div');
    this.table.classList.add('table');
    this.table.innerHTML = `<span>World</span>
      <span>Confirmed: ${this.summary.TotalConfirmed}</span>
      <span>Deaths: ${this.summary.TotalDeaths}</span>
      <span>Recovered: ${this.summary.TotalRecovered}</span>`;
    return this.table;
  }

  renderTable(countryData) {
    this.table.innerHTML = `<span>${countryData.Country}</span>
      <span>Confirmed: ${countryData.TotalConfirmed}</span>
      <span>Deaths: ${countryData.TotalDeaths}</span>
      <span>Recovered: ${countryData.TotalRecovered}</span>`;
  }
}

export default Table;
