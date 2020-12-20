import countriesData from '../assets/geoJSON/ne_50m_admin_0_countries.geojson';

const { L } = window;

class Map {
  constructor() {
    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'covid-map';
    this.accessToken = 'Dk3ieXPC5OJdzTIGsMaADdbJPAN8V9QAB7ZCOLL6PXtzkPv4CsgDv6OVNtoRJQkn';
  }

  displayMap() {
    const map = L.map('covid-map').setView([53.9132573, 27.5943], 6);

    L.tileLayer(`https://a.tile.jawg.io/jawg-dark/{z}/{x}/{y}@2x.png?access-token=${this.accessToken}&lang=en`)
      .addTo(map);

    L.geoJSON(countriesData).addTo(map);
  }
}

export default Map;
