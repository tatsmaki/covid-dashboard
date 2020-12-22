import ApiCall from './ApiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';
import Map from './Map';

class Page {
  constructor() {
    this.displayPage();
    this.apiData = new ApiCall();
    this.buttons = [];
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
    document.querySelector('main').appendChild(fragment);
  }

  async waitForApi() {
    await this.apiData.getPopulation();
    await this.apiData.requestSummary();

    this.countriesList = new List(this.apiData.countriesDataObject);
    // original buttons for list
    this.listButtons = this.countriesList.displayButtons();
    this.listButtons.valueType.addEventListener('click', this.clickTypeValueOption.bind(this));
    this.listButtons.period.addEventListener('click', this.clickPeriodBtn.bind(this));
    this.listButtons.node.addEventListener('click', this.statusHandler.bind(this));
    this.buttons.push({
      valueType: this.listButtons.valueType,
      period: this.listButtons.period,
      node: this.listButtons.node,
      case: this.listButtons.case,
    });
    this.listComponent.append(
      this.listButtons.valueType,
      this.listButtons.period,
      this.listButtons.node,
    );
    // sort list by default
    this.countriesList.sortBy('Total', 'Confirmed', 'absolute');
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.search.addEventListener('input', this.inputHandler.bind(this));
    this.listComponent.appendChild(this.list);

    this.tableData = new Table(this.apiData.summaryData.Global);
    // clone buttons for table
    this.tableComponent.append(...this.cloneButtons(), this.tableData.displayTable());

    await this.apiData.requestWorldData();
    this.chartData = new Graph(this.apiData.worldData);
    // clone buttons for chart
    const chartControl = document.createElement('div');
    chartControl.classList.add('chart-control');
    chartControl.append(...this.cloneButtons());
    this.chartComponent.append(chartControl, this.chartData.displayChart());

    this.awesomeMap = new Map(this.apiData.countriesDataObject);
    this.mapComponent.appendChild(this.awesomeMap.mapContainer);
    this.awesomeMap.displayMap();
    //     this.awesomeMap = new Map();
    // clone buttons for map
    const mapControl = document.createElement('div');
    mapControl.classList.add('map-control');
    mapControl.append(...this.cloneButtons());
    this.mapComponent.append(mapControl);
  }

  cloneButtons() {
    const { length } = this.buttons;
    const nodeClone = this.listButtons.node.cloneNode(true);
    const casesLink = nodeClone.getElementsByClassName('link')[0];
    const periodLink = this.listButtons.period.cloneNode(true);
    const valueTypeLink = this.listButtons.valueType.cloneNode(true);
    this.buttons.push({
      valueType: valueTypeLink,
      period: periodLink,
      node: nodeClone,
      case: casesLink,
    });
    this.buttons[length].node.addEventListener('click', this.statusHandler.bind(this));
    this.buttons[length].period.addEventListener('click', this.clickPeriodBtn.bind(this));
    this.buttons[length].valueType.addEventListener('click', this.clickTypeValueOption.bind(this));
    return [
      this.buttons[length].valueType,
      this.buttons[length].period,
      this.buttons[length].node,
    ];
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
    this.buttons.forEach((button) => {
      const btn = button;
      btn.case.textContent = status;
    });
    this.setView();
    this.updateList();
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
    this.buttons.forEach((button) => {
      const btn = button;
      btn.period.textContent = this.tableData.getAnotherPeriod();
    });
    this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
    this.setView();
    this.updateList();
  }

  setView() {
    this.TIME = this.listButtons.period.textContent === 'Total' ? 'New' : 'Total';
    this.STATUS = this.listButtons.case.textContent;
    this.VIEW = this.listButtons.valueType.value;
    this.countriesList.sortBy(this.TIME, this.STATUS, this.VIEW);
    this.chartData.changeView(this.TIME, this.STATUS, this.VIEW);
  }

  updateList() {
    this.list.removeEventListener('click', this.clickHandler);
    this.list.remove();
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.listComponent.appendChild(this.list);
  }

  clickTypeValueOption(e) {
    if (e.target.value !== this.tableData.valueType) {
      this.tableData.setValueType(e.target.value);
      this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
      this.buttons.forEach((button) => {
        const option = [...button.valueType].find((opt) => e.target.value === opt.value);
        option.selected = true;
      });
      this.setView();
      this.updateList();
    }
  }
}

export default Page;
