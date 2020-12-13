import ApiCall from './apiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';

class Page {
    constructor() {
        this.displayPage();
        this.apiData = new ApiCall();
        this.waitForApi();
    }

    displayPage() {
        const fragment = document.createDocumentFragment();
        this.listComponent = document.createElement('div');
        this.listComponent.classList.add('list-component');
        fragment.appendChild(this.listComponent);
        this.tableComponent = document.createElement('div');
        this.tableComponent.classList.add('table-component');
        fragment.appendChild(this.tableComponent);
        this.graphComponent = document.createElement('div');
        this.graphComponent.classList.add('graph-component');
        fragment.appendChild(this.graphComponent);
        document.body.appendChild(fragment);
    }

    async waitForApi() {
        await this.apiData.requestData('summary', 0);
        this.countriesList = new List(this.apiData.summaryData.Countries);
        const list = this.countriesList.displayList();

        list.addEventListener('click', this.clickHandler.bind(this));

        this.listComponent.appendChild(list);
        this.tableData = new Table(this.apiData.summaryData.Global);
        this.tableComponent.appendChild(this.tableData.displayTable());
        await this.apiData.requestData('world', 0);
        this.graphData = new Graph(this.apiData.worldData);
        this.graphComponent.appendChild(this.graphData.displayChart());
    } 

    async clickHandler(event) {
        if (event.target !== event.currentTarget) {
            const countryCode = event.target.closest('li').getAttribute('data-country');
            console.log(countryCode)
            await this.apiData.requestCountry(countryCode, 0);
            this.tableData.renderTable(this.apiData[countryCode]);
            this.graphData.renderChart(this.apiData[countryCode]);
        }
    }
}

export default Page;
