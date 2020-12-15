class Table {
    constructor(summary) {
        this.summary = summary;
        this.period = 'full year';
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
        if (this.period === 'full year') {
            return 'last day';
        }
        return 'full year';
    }
    setAnotherPeriod() {
        this.period = this.period === 'full year' ? 'last day' : 'full year';
    }

    displayTable() {
        this.table = document.createElement('div');
        this.table.classList.add('table');
        return this.setTableData();
    }
    
    setTableData(data = this.summary, country = 'World') {
        this.table.innerHTML =
            `<span>${country} for ${this.period} and with ${this.relativeAbsoluteValue}</span>
        <span>Confirmed: ${data.TotalConfirmed}</span>
        <span>Deaths: ${data.TotalDeaths}</span>
        <span>Recovered: ${data.TotalRecovered}</span>`
        return this.table;
    }

    renderTable(countryData) {
        const lastDay = countryData.pop();
        console.log(lastDay)
        this.table.innerHTML =
            `<span>${lastDay.Country} for ${this.period} and with ${this.relativeAbsoluteValue}</span>
        <span>Confirmed: ${lastDay.Confirmed}</span>
        <span>Deaths: ${lastDay.Deaths}</span>
        <span>Recovered: ${lastDay.Recovered}</span>`
    }
}

export default Table;
