class Table {
  constructor(summary) {
    this.summary = summary;
    this.period = 'Total';
    this.relativeAbsoluteValue = 'absolute value';
    console.log('create table')
  }

  getAnotherRelativeAbsoluteValue() {
    if (this.relativeAbsoluteValue === 'absolute value') {
      return 'relative value';
    }
    return 'absolute value';
  }

  setAnotherRelativeAbsoluteValue() {
    this.relativeAbsoluteValue = this.relativeAbsoluteValue === 'absolute value' ? 'relative value' : 'absolute value';
  }

  getAnotherPeriod() {
    if (this.period === 'Total') {
      return 'new';
    }
    return 'total';
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
    this.table.innerHTML =
      `<span>World for ${this.period} and with ${this.relativeAbsoluteValue}</span>
        <span>Confirmed: ${this.summary.TotalConfirmed}</span>
        <span>Deaths: ${this.summary.TotalDeaths}</span>
        <span>Recovered: ${this.summary.TotalRecovered}</span>`
    return this.table;
  }

  renderTable(countryData) {
    // const prefix = this.getPrefix();
    // console.log(prefix);
    console.log(countryData);
    if(this.relativeAbsoluteValue.includes('relative')){
      const relativeConfirmed = (countryData[`${this.period}Confirmed`] * 100000) / countryData.population;
      const relativeDeaths = (countryData[`${this.period}Deaths`] * 100000) / countryData.population;
      const relativeRecovered = (countryData[`${this.period}Recovered`] * 100000) / countryData.population;
      this.table.innerHTML = `<span>${countryData.Country} for ${this.period.toLowerCase()} and with ${this.relativeAbsoluteValue}</span>
      <span>Confirmed: ${relativeConfirmed}</span>
      <span>Deaths: ${relativeDeaths}</span>
      <span>Recovered: ${relativeRecovered}</span>`;
    } else {
      this.table.innerHTML = `<span>${countryData.Country} for ${this.period.toLowerCase()} and with ${this.relativeAbsoluteValue}</span>
      <span>Confirmed: ${countryData[`${this.period}Confirmed`]}</span>
      <span>Deaths: ${countryData[`${this.period}Deaths`]}</span>
      <span>Recovered: ${countryData[`${this.period}Recovered`]}</span>`;
    }
  }
  // getPrefix(){
  //   if(this.period === 'Total'){
  //     return 'Total';
  //   }
  //   return 'New';
  // }
}

export default Table;
