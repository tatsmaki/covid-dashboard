class Map {
  constructor() {
    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'covid-map';
  }

  displayMap() {
    this.map = L.map('covid-map').setView([53.9132573, 27.5943], 6);
    L.tileLayer('https://a.tile.jawg.io/jawg-dark/{z}/{x}/{y}@2x.png?access-token=Dk3ieXPC5OJdzTIGsMaADdbJPAN8V9QAB7ZCOLL6PXtzkPv4CsgDv6OVNtoRJQkn&lang=en')
      .addTo(this.map);
  }
}

export default Map;
