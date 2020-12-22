import countriesData from '../assets/geoJSON/ne_50m_admin_0_countries.geojson';

const { L } = window;

class Map {
  constructor(apiData) {
    this.apiData = apiData;
    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'covid-map';
    this.style = this.style.bind(this);
    this.insertGeoJSON = L.geoJSON.bind(this);
    this.createLegend = this.createLegend.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.createInfoControl = this.createInfoControl.bind(this);
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

    this.maxPercentage = this.findMaxPercentage();

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
    const countryCode = feature.properties.iso_a2;
    const countryInfo = this.apiData.get(countryCode);
    return {
      fillColor: '#f00',
      fillOpacity: countryInfo ? this.getPercentage(countryInfo) : 0,
      weight: 0,
      opacity: 0,
    };
  }

  getPercentage(countryInfo) {
    const countryPercentage = countryInfo.TotalConfirmed / countryInfo.population;
    return (countryPercentage / this.maxPercentage) * 100;
  }

  createLegend() {
    const legend = L.control({ position: 'bottomright' });
    const { maxPercentage } = this;

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const levels = [0.2, 0.4, 0.6, 0.8, 1];
      const grades = levels.map((percentage) => Math.round(maxPercentage * percentage * 10) / 10);

      grades.forEach((grade, ind) => {
        div.innerHTML += `<span><i style="background: #f00; opacity: ${levels[ind]}"></i> <${grade}%</span>`;
      });

      return div;
    };

    legend.addTo(this.map);
  }

  findMaxPercentage() {
    let maxPercentage = 0;

    this.apiData.forEach((value) => {
      const countryInfo = value;
      const countryPercentage = (countryInfo.TotalConfirmed / countryInfo.population) * 100;
      if (countryPercentage > maxPercentage) maxPercentage = countryPercentage;
    });

    return Math.round(maxPercentage);
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
    });
  }

  createInfoControl() {
    this.info = L.control();

    this.info.onAdd = () => {
      this.div = L.DomUtil.create('div', 'info');
      this.info.update();
      return this.div;
    };

    this.info.update = (props) => {
      if (!props) {
        this.div.innerHTML = '<h4>Country total cases</h4>Hover over a country';
        return;
      }

      const code = props.iso_a2;
      const countryInfo = this.apiData.get(code);
      const percentage = countryInfo ? (countryInfo.TotalConfirmed / countryInfo.population) * 100
        : undefined;

      this.div.innerHTML = `<h4>Country total cases</h4>${countryInfo
        ? `<b>${props.name}</b><br>${Math.round(percentage * 100) / 100}% of population`
        : 'No information about this country'}`;
    };

    this.info.addTo(this.map);
  }
}

export default Map;
