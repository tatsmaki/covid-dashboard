import ApiCall from './ApiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';
import Map from './Map';

class Page {
  constructor() {
    this.displayPage();
    this.apiData = new ApiCall();
    this.waitForApi();
  }

  displayPage() {
    const fragment = document.createDocumentFragment();

    this.listComponent = document.createElement('div');
    this.search = document.createElement('input');
    const main = document.createElement('div');
    this.mapComponent = document.createElement('div');
    const tableAndChart = document.createElement('div');
    this.tableComponent = document.createElement('div');
    this.chartComponent = document.createElement('div');

    this.listComponent.classList.add('list-component');
    this.search.classList.add('search');
    this.search.placeholder = 'search';
    main.classList.add('main');
    this.mapComponent.classList.add('map-component');
    tableAndChart.classList.add('table-and-chart');
    this.tableComponent.classList.add('table-component');
    this.chartComponent.classList.add('chart-component');

    fragment.appendChild(this.listComponent);
    this.listComponent.appendChild(this.search);
    fragment.appendChild(main);
    main.appendChild(this.mapComponent);
    main.appendChild(tableAndChart);
    tableAndChart.appendChild(this.tableComponent);
    tableAndChart.appendChild(this.chartComponent);
    document.body.appendChild(fragment);
  }

  async waitForApi() {
    await this.apiData.requestSummary();

    this.countriesList = new List(this.apiData.summaryData.Countries);
    const list = this.countriesList.displayList();
    list.addEventListener('click', this.clickHandler.bind(this));
    this.listComponent.appendChild(list);

    this.tableData = new Table(this.apiData.summaryData.Global);
    this.tableComponent.appendChild(this.tableData.displayTable());

    await this.apiData.requestWorldData();

    this.chartData = new Graph(this.apiData.worldData);
    this.chartComponent.appendChild(this.chartData.displayChart());

    this.awesomeMap = new Map();
  }

  async clickHandler(event) {
    if (event.target !== event.currentTarget) {
      const countryCode = event.target.closest('li').getAttribute('data-country');
      console.log(countryCode);
      await this.apiData.requestCountry(countryCode);
      this.tableData.renderTable(this.apiData[`${countryCode}`.table]);
      await this.apiData.requestCountryTimeline(countryCode);

      const status = 'cases';
      this.chartData.renderChart(this.apiData[`${countryCode}`.chart], status);
    }
  }
}

export default Page;
