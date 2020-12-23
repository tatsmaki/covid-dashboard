import countriesData from '../assets/geoJSON/ne_50m_admin_0_countries.geojson';
import {
  confirmedStatus,
  defaultView,
  relativeView,
  newPeriod,
  totalPeriod,
  deathsStatus,
  percentageView,
  recoveredStatus,
} from '../constants/const';

const { L } = window;

class Map {
  constructor(apiData) {
    this.TIME = totalPeriod;
    this.STATUS = confirmedStatus;
    this.VIEW = defaultView;

    this.apiData = apiData;
    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'covid-map';
    this.style = this.style.bind(this);
    this.insertGeoJSON = L.geoJSON.bind(this);
    this.createLegend = this.createLegend.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.createLegend = this.createLegend.bind(this);
    this.createInfoControl = this.createInfoControl.bind(this);
    this.countryClick = this.countryClick.bind(this);

    this.pseudoCountryDiv = document.createElement('div');
    this.pseudoCountryDiv.classList.add('pseudoCountry');
    this.pseudoCountryDiv.style.display = 'none';
    document.body.appendChild(this.pseudoCountryDiv);
  }

  static getAccessToken() {
    return 'Dk3ieXPC5OJdzTIGsMaADdbJPAN8V9QAB7ZCOLL6PXtzkPv4CsgDv6OVNtoRJQkn';
  }

  displayMap() {
    this.map = L.map('covid-map').setView([53.9132573, 27.5943], 6);
    this.map.createPane('labels');

    L.tileLayer(`https://tile.jawg.io/cf8c75b9-02a1-4145-8842-62d173b20ed3/{z}/{x}/{y}@2x.png?access-token=${Map.getAccessToken()}`, {
      noWrap: true,
    }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png', {
      noWrap: true,
      pane: 'labels',
    }).addTo(this.map);

    this.maxNum = this.findMaxNumber(this.TIME, this.STATUS, this.VIEW);

    this.geoJSON = this.insertGeoJSON(countriesData, {
      style: this.style,
      onEachFeature: this.onEachFeature,
    }).addTo(this.map);

    this.map.getPane('labels').style.zIndex = 650;
    this.map.getPane('labels').style.pointerEvents = 'none';

    this.createLegend();
    this.createInfoControl();
  }

  style(feature) {
    return {
      fillColor: Map.getColor(this.STATUS),
      fillOpacity: this.getOpacity(feature, this.TIME, this.STATUS, this.VIEW),
      weight: 0,
      opacity: 0,
    };
  }

  static getColor(status) {
    switch (status) {
      case confirmedStatus:
        return 'red';
      case recoveredStatus:
        return 'green';
      case deathsStatus:
        return 'black';
      default:
        break;
    }

    return 'orange';
  }

  getOpacity(feature, time, status, view) {
    const countryCode = feature.properties.iso_a2;
    const countryInfo = this.apiData[countryCode];

    if (!countryInfo) return 0;

    const countryNum = Map.getNum(countryInfo, time, status, view);

    return countryNum / this.maxNum;
  }

  findMaxNumber(time, status, view) {
    let maxNum = 0;

    Object.values(this.apiData).forEach((value) => {
      const countryInfo = value;
      const countryNum = Map.getNum(countryInfo, time, status, view);

      if (countryNum > maxNum) maxNum = countryNum;
    });

    return maxNum;
  }

  static getNum(countryInfo, time, status, view) {
    let countryNum = countryInfo[`${time === newPeriod ? newPeriod : totalPeriod}${status}`];
    if (view !== defaultView) {
      countryNum = (countryNum / countryInfo.population) * 100;
    }

    return countryNum;
  }

  createLegend() {
    this.legend = L.control({ position: 'bottomright' });

    this.legend.onAdd = () => {
      this.legendDiv = L.DomUtil.create('div', 'info legend');
      this.legend.update();
      return this.legendDiv;
    };

    this.legend.update = () => {
      this.legendDiv.innerHTML = '';

      const levels = [0.2, 0.4, 0.6, 0.8, 1];
      const coefficient = this.STATUS !== deathsStatus ? 10 : 1000;
      const grades = levels.map((percentage) => Math.round(this.maxNum * percentage * coefficient)
        / coefficient);

      grades.forEach((grade, ind) => {
        this.legendDiv.innerHTML += `<span><i style="background: ${Map.getColor(this.STATUS)}; opacity: ${levels[ind]}"></i> ~${this.VIEW === percentageView ? `${grade}%` : `${this.STATUS !== deathsStatus || this.VIEW === defaultView ? Math.round(grade) : grade}`}</span>`;
      });
    };

    this.legend.addTo(this.map);
  }

  highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
      fillColor: '#ABCDEF',
      fillOpacity: 0.4,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.info.update(layer.feature.properties);
  }

  resetHighlight(e) {
    this.geoJSON.resetStyle(e.target);
    this.info.update();
  }

  onEachFeature(_, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.countryClick,
    });
  }

  createInfoControl() {
    this.info = L.control();

    this.info.onAdd = () => {
      this.infoDiv = L.DomUtil.create('div', 'info');
      this.info.update();
      return this.infoDiv;
    };

    this.info.update = (props) => {
      if (!props) {
        this.infoDiv.innerHTML = '<h4>Country total cases</h4>Hover over a country';
        return;
      }

      const code = props.iso_a2;
      const countryInfo = this.apiData[code];
      const percentage = countryInfo ? (countryInfo[`${this.TIME === newPeriod ? newPeriod : totalPeriod }${this.STATUS}`] / countryInfo.population) * 100
        : undefined;

      let info;
      switch (this.VIEW) {
        case defaultView:
          info = countryInfo ? countryInfo[`${this.TIME === newPeriod ? newPeriod : totalPeriod}${this.STATUS}`] : undefined;
          break;
        case relativeView:
          info = countryInfo ? (countryInfo[`${this.TIME === newPeriod ? newPeriod : totalPeriod}${this.STATUS}`] / countryInfo.population) * 100000
            : undefined;
          info = Math.round(info);
          break;
        case percentageView:
          info = `${Math.round(percentage * 100) / 100}%`;
          break;
        default:
          break;
      }

      this.infoDiv.innerHTML = `<h4>Country total cases</h4>${countryInfo
        ? `<b>${props.name}</b><br>${info} of population`
        : 'No information about this country'}`;
    };

    this.info.addTo(this.map);
  }

  update(TIME, STATUS, VIEW) {
    this.TIME = TIME;
    this.STATUS = STATUS;
    this.VIEW = VIEW;

    this.maxNum = this.findMaxNumber(this.TIME, this.STATUS, this.VIEW);
    this.legend.update();
    this.geoJSON.setStyle(this.style);
  }

  countryClick(fragment) {
    const code = fragment.target.feature.properties.iso_a2;
    this.pseudoCountryDiv.innerHTML = code;
  }

  reSize() {
    this.map.invalidateSize();
  }
}

export default Map;
