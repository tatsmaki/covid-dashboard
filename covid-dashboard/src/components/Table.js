class Table {
    constructor(summary) {
        this.summary = summary;
        console.log('create table')
    }

    displayTable() {
        this.table = document.createElement('div');
        this.table.classList.add('table');
        this.table.innerHTML = 
        `<span>World</span>
        <span>Confirmed: ${this.summary.TotalConfirmed}</span>
        <span>Deaths: ${this.summary.TotalDeaths}</span>
        <span>Recovered: ${this.summary.TotalRecovered}</span>`
        return this.table;
    }

    renderTable(countryData) {
        const lastDay = countryData.pop();
        console.log(lastDay)
        this.table.innerHTML = 
        `<span>${lastDay.Country}</span>
        <span>Confirmed: ${lastDay.Confirmed}</span>
        <span>Deaths: ${lastDay.Deaths}</span>
        <span>Recovered: ${lastDay.Recovered}</span>`
    }
}

export default Table;
