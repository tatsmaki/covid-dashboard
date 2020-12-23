import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import ApiCall from './ApiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';
import Map from './Map';

import {
  confirmedStatus,
  deathsStatus,
  defaultView,
  recoveredStatus,
  totalPeriod,
} from '../constants/const';

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
    this.fullScreenBtn = document.createElement('button');
    const searchFullScreenSection = document.createElement('div');
    const main = document.createElement('div');
    this.mapComponent = document.createElement('div');
    const tableAndChart = document.createElement('div');
    this.tableComponent = document.createElement('div');
    this.chartComponent = document.createElement('div');

    this.listComponent.classList.add('list-component', 'component-wrapper');
    searchFullScreenSection.classList.add('search-full-section');
    this.search.classList.add('search');
    this.search.placeholder = 'search';
    this.fullScreenBtn.classList.add('full-screen-btn');
    this.fullScreenBtn.addEventListener('click', this.setFullscreenSection.bind(this));
    main.classList.add('main');
    this.mapComponent.classList.add('map-component', 'component-wrapper');
    tableAndChart.classList.add('table-and-chart');
    this.tableComponent.classList.add('table-component', 'component-wrapper');
    this.chartComponent.classList.add('chart-component', 'component-wrapper');

    fragment.append(this.listComponent, main);
    searchFullScreenSection.append(this.search, this.fullScreenBtn);
    this.listComponent.appendChild(searchFullScreenSection);
    main.append(this.mapComponent, tableAndChart);
    tableAndChart.append(this.tableComponent, this.chartComponent);
    document.querySelector('main').appendChild(fragment);

    const simple = document.querySelector('.simple-keyboard');
    const keyboard = new Keyboard({
      onChange: (input) => this.onChange(input),
    });
    keyboard.superUsefulFieldToMakeEslintHappy = null;
    simple.addEventListener('click', (event) => {
      if (event.target.textContent === '@') {
        this.search.value = this.search.value.replace(/@/g, '');
        simple.id = 'hide';
        this.inputHandler();
      }
    });
    this.search.addEventListener('click', () => {
      simple.id = '';
    });
  }

  onChange(input) {
    document.querySelector('input').value = input.replace(/@/g, '');
    this.inputHandler();
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
    this.countriesList.sortBy(totalPeriod, confirmedStatus, defaultView);
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.search.addEventListener('input', this.inputHandler.bind(this));
    this.listComponent.appendChild(this.list);

    this.tableData = new Table(this.apiData.summaryData.Global);
    // clone buttons for table
    const dropdownFullScreenSection = document.createElement('div');
    dropdownFullScreenSection.classList.add('dropdown-full-section');
    const cloneTableButtons = this.cloneButtons();
    const fullScreenTableBtn = this.fullScreenBtn.cloneNode(true);
    dropdownFullScreenSection.append(cloneTableButtons[0], fullScreenTableBtn);
    fullScreenTableBtn.addEventListener('click', this.setFullscreenSection.bind(this));
    this.tableComponent.append(dropdownFullScreenSection, cloneTableButtons[1],
      cloneTableButtons[2], this.tableData.displayTable());

    await this.apiData.requestWorldData();
    this.chartData = new Graph(this.apiData.worldData);
    this.chartData.setData(this.apiData.countriesDataObject);
    // clone buttons for chart
    const chartControl = document.createElement('div');
    chartControl.classList.add('chart-control');
    const fullScreenChartBtn = this.fullScreenBtn.cloneNode(true);
    fullScreenChartBtn.addEventListener('click', this.setFullscreenSection.bind(this));
    chartControl.append(...this.cloneButtons(), fullScreenChartBtn);
    this.chartComponent.append(chartControl, this.chartData.displayChart());

    this.awesomeMap = new Map(this.apiData.countriesDataObject);
    this.mapComponent.appendChild(this.awesomeMap.mapContainer);
    this.awesomeMap.displayMap();
    // clone buttons for map
    const mapControl = document.createElement('div');
    mapControl.classList.add('map-control');
    const fullScreenMapBtn = this.fullScreenBtn.cloneNode(true);
    fullScreenMapBtn.addEventListener('click', this.setFullscreenSection.bind(this));
    mapControl.append(...this.cloneButtons(), fullScreenMapBtn);
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
      case confirmedStatus: this.renderStatus(recoveredStatus); break;
      case recoveredStatus: this.renderStatus(deathsStatus); break;
      case deathsStatus: this.renderStatus(confirmedStatus); break;
      default: break;
    }
  }

  prevStatus() {
    switch (this.listButtons.case.textContent) {
      case confirmedStatus: this.renderStatus(deathsStatus); break;
      case deathsStatus: this.renderStatus(recoveredStatus); break;
      case recoveredStatus: this.renderStatus(confirmedStatus); break;
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
      this.chartData.setFlag(
        this.apiData.countriesDataObject[this.countryCode].svg,
        this.countryCode,
      );
      this.setView();
      this.chartData.renderChart(this.apiData[`${this.countryCode}chart`], this.TIME, this.STATUS, this.VIEW);
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
      btn.period.textContent = this.tableData.getPeriod();
    });
    this.tableData.renderTable(this.apiData.countriesDataObject[this.countryCode]);
    this.setView();
    this.updateList();
  }

  setView() {
    this.TIME = this.listButtons.period.textContent;
    this.STATUS = this.listButtons.case.textContent;
    this.VIEW = this.listButtons.valueType.value;
    this.countriesList.sortBy(this.TIME, this.STATUS, this.VIEW);
    this.chartData.renderChart(this.apiData[`${this.countryCode}chart`], this.TIME, this.STATUS, this.VIEW);
    this.awesomeMap.update(this.TIME, this.STATUS, this.VIEW);
  }

  updateList() {
    this.list.removeEventListener('click', this.clickHandler);
    this.list.remove();
    this.list = this.countriesList.displayList();
    this.list.addEventListener('click', this.clickHandler.bind(this));
    this.listComponent.appendChild(this.list);
    this.inputHandler();
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

  setFullscreenSection(e) {
    const sectionWrapperElement = e.target.closest('.component-wrapper');
    sectionWrapperElement.classList.add('full-screen-wrapper', 'bg-dark');
    e.target.classList.add('close-full-screen-btn');
    e.target.removeEventListener('click', this.setFullscreenSection);
    e.target.addEventListener('click', this.setNotFullscreenSection.bind(this));
  }

  setNotFullscreenSection(e) {
    const sectionWrapperElement = e.target.closest('.component-wrapper');
    sectionWrapperElement.classList.remove('full-screen-wrapper', 'bg-dark');
    e.target.classList.remove('close-full-screen-btn');
    e.target.addEventListener('click', this.setFullscreenSection.bind(this));
    e.target.removeEventListener('click', this.setNotFullscreenSection);
  }
}

export default Page;
