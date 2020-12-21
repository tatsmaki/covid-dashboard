import ApiCall from './ApiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';
import Map from './Map';

class Page {
  constructor() {
    this.displayPage();
    this.apiData = new ApiCall();
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

    fragment.append(this.listComponent, main);
    this.listComponent.appendChild(this.search);
    main.append(this.mapComponent, tableAndChart);
    tableAndChart.append(this.tableComponent, this.chartComponent);
    document.body.appendChild(fragment);
  }

  async waitForApi() {
    await this.apiData.getPopulation();
    await this.apiData.requestSummary();

    this.countriesList = new List(this.apiData.countriesDataObject);
    this.listButtons = this.countriesList.displayButtons();
    this.listButtons.valueType.addEventListener('click', this.clickTypeValueOption.bind(this));
    this.listButtons.period.addEventListener('click', this.clickPeriodBtn.bind(this));
    this.listButtons.node.addEventListener('click', this.statusHandler.bind(this));
    this.listComponent.append(
      this.listButtons.valueType,
      this.listButtons.period,
      this.listButtons.node,
    );
    this.countriesList.sortBy('Total', 'Confirmed');
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.search.addEventListener('input', this.inputHandler.bind(this));
    this.listComponent.appendChild(this.list);

    this.tableData = new Table(this.apiData.summaryData.Global);
    const tableNode = this.listButtons.node.cloneNode(true);
    const tableCasesLink = tableNode.getElementsByClassName('link')[0];
    const tablePeriodLink = this.listButtons.period.cloneNode(true);
    const tableValueTypeLink = this.listButtons.valueType.cloneNode(true);
    this.tableButtons = {
      node: tableNode,
      period: tablePeriodLink,
      valueType: tableValueTypeLink,
      case: tableCasesLink,
    };

    this.tableButtons.node.addEventListener('click', this.statusHandler.bind(this));
    this.tableButtons.period.addEventListener('click', this.clickPeriodBtn.bind(this));
    this.tableButtons.valueType.addEventListener('click', this.clickTypeValueOption.bind(this));
    this.tableComponent.append(
      this.tableButtons.valueType,
      this.tableButtons.period,
      this.tableButtons.node,
      this.tableData.displayTable(),
    );

    await this.apiData.requestWorldData();

    this.chartData = new Graph(this.apiData.worldData);
    const chartNode = this.listButtons.node.cloneNode(true);
    const chartCasesLink = chartNode.getElementsByClassName('link')[0];
    this.chartButtons = {
      node: chartNode,
      case: chartCasesLink,
    };
    this.chartButtons.node.addEventListener('click', this.statusHandler.bind(this));
    this.chartComponent.append(this.chartButtons.node, this.chartData.displayChart());

    this.awesomeMap = new Map();
  }

  statusHandler(event) {
    switch (event.target.textContent) {
      case '>': this.nextStatus(); break;
      case '<': this.prevStatus(); break;
      default: break;
    }
  }

  nextStatus() {
    switch (this.listButtons.case.textContent) {
      case 'Confirmed': this.renderStatus('Recovered'); break;
      case 'Recovered': this.renderStatus('Deaths'); break;
      case 'Deaths': this.renderStatus('Confirmed'); break;
      default: break;
    }
  }

  prevStatus() {
    switch (this.listButtons.case.textContent) {
      case 'Confirmed': this.renderStatus('Deaths'); break;
      case 'Deaths': this.renderStatus('Recovered'); break;
      case 'Recovered': this.renderStatus('Confirmed'); break;
      default: break;
    }
  }

  renderStatus(status) {
    this.listButtons.case.textContent = status;
    this.chartButtons.case.textContent = status;
    this.tableButtons.case.textContent = status;
    this.countriesList.sortBy('Total', status);
    this.list.removeEventListener('click', this.clickHandler);
    this.list.remove();
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.listComponent.appendChild(this.list);
  }

  async clickHandler(event) {
    if (event.target !== event.currentTarget) {
      this.countryCode = event.target.closest('li').getAttribute('data-country');
      this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
      if (!this.apiData[`${this.countryCode}chart`]) {
        await this.apiData.requestCountryTimeline(this.countryCode);
      }
      const status = 'cases';
      this.chartData.setFlag(this.apiData.countriesDataObject[this.countryCode].svg);
      this.chartData.renderChart(this.apiData[`${this.countryCode}chart`], status);
    }
  }

  inputHandler() {
    const look = this.search.value.toLowerCase();
    [...this.countriesList.list.children].forEach((item) => {
      if (!item.getAttribute('data-search').includes(look)) {
        item.classList.add('hide');
      } else {
        item.classList.remove('hide');
      }
    });
  }

  clickPeriodBtn() {
    this.tableData.setAnotherPeriod();
    this.listButtons.period.textContent = this.tableData.getAnotherPeriod();
    this.tableButtons.period.textContent = this.tableData.getAnotherPeriod();
    this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
  }

  clickTypeValueOption(e) {
    if (e.target.value !== this.tableData.valueType) {
      this.tableData.setValueType(e.target.value);
      this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
      [...this.tableButtons.valueType].forEach((item) => {
        if (e.target.value === item.value) {
          item.selected = true;
        }
      });
      [...this.listButtons.valueType].forEach((item) => {
        if (e.target.value === item.value) {
          item.selected = true;
        }
      });
    }
  }
}

export default Page;
